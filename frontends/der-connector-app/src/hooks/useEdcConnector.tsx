import {
  AssetInput,
  ContractDefinitionInput,
  EdcConnectorClient,
  PolicyBuilder,
  TransferProcessStates,
} from "@think-it-labs/edc-connector-client";
import { useMetadata } from "./useMetadata";

export const useEdcConnector = () => {
  const { defaultName, defaultContenttype, defaultDescription, meta } =
    useMetadata();

  const client: EdcConnectorClient = new EdcConnectorClient.Builder()
    .defaultUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_DEFAULT_URL)
    .managementUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_MANAGEMENT_URL)
    .protocolUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_PROTOCOL_URL)
    .controlUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_CONTROL_URL)
    .publicUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_PUBLIC_URL)
    .build();

  const clearEverything = async () => {
    // stop all transfers
    const transfers = await client.management.transferProcesses.queryAll();
    for (const transfer of transfers) {
      if (transfer.state !== TransferProcessStates.DEPROVISIONED) {
        await client.management.transferProcesses.terminate(
          transfer.id,
          "terminated by user"
        );
      }
    }

    // terminate all contract negotiations
    const contractNegotiations =
      await client.management.contractNegotiations.queryAll();
    for (const contractNegotiation of contractNegotiations) {
      await client.management.contractNegotiations.terminate(
        contractNegotiation.id,
        "terminated by user"
      );
    }

    // delete all contract definitions
    const contractDefinitions =
      await client.management.contractDefinitions.queryAll();
    for (const contractDefinition of contractDefinitions) {
      await client.management.contractDefinitions.delete(contractDefinition.id);
    }

    // delete all policy definitions
    const policyDefinitions =
      await client.management.policyDefinitions.queryAll();
    for (const policyDefinition of policyDefinitions) {
      await client.management.policyDefinitions.delete(policyDefinition.id);
    }
  };

  const createOfferRemoteControlTimeRestricted = async (
    participantId: string,
    start: string,
    end: string
  ) => {
    // create offer
    console.log("Creating offer for participant", participantId);
    console.log("Start:", start);
    console.log("End:", end);

    // up asset
    const asset = await updateAsset("wind-turbine-a1");
    console.log("Updated Asset:", asset);

    // new policy definition
    const policeDefintion = await createPolicyDefintion(
      participantId,
      start,
      end
    );
    console.log("New PoliceDefintion:", policeDefintion);

    const contractDefinition = await createContractDefinition(
      asset.id,
      policeDefintion.id,
      policeDefintion.id
    );
    console.log("New contractDefinition:", contractDefinition);
  };

  const createPolicyDefintion = async (
    participantId: string,
    start: string,
    end: string
  ) => {
    console.log("Creating policy definition for participant", participantId);
    console.log("Start:", start);
    console.log("End:", end);

    const policyBuilder = new PolicyBuilder();

    // will restrict access to the asset to the participantId
    // maybe add a time constraint later
    const policy = policyBuilder
      .type("Set")
      .raw({
        permission: [
          {
            action: "use",
            constraint: [
              {
                "@type": "AtomicConstraint",
                leftOperand: "identity",
                operator: "eq",
                rightOperand: participantId,
              },
            ],
          },
        ],
        prohibition: [],
        obligation: [],
      })
      .build();

    const createdPolicyDefinitionResponse =
      await client.management.policyDefinitions.create({
        policy: policy,
      });

    const policyDefinition = await client.management.policyDefinitions.get(
      createdPolicyDefinitionResponse.id
    );
    console.log("PolicyDefinition:", policyDefinition);

    return policyDefinition;
  };

  const updateAsset = async (assetId: string) => {
    console.log("Creating asset for assetId", assetId);
    console.log("Meta:", meta);

    const assetInput: AssetInput = {
      "@id": assetId,
      dataAddress: {
        type: "HttpData",
        baseUrl: "http://dea-rest-api:5000",
        proxyPath: "true",
        proxyQueryParams: "true",
        proxyBody: "true",
        proxyMethod: "true",
      },
      properties: {
        name: defaultName,
        description: defaultDescription,
        contenttype: defaultContenttype,
        metadata: meta,
      },
    };

    await client.management.assets.update(assetInput);
    const asset = await client.management.assets.get(assetId);
    console.log("Updated asset:", asset);

    return asset;
  };

  const createContractDefinition = async (
    // determines the asset for which the contract definition is created
    assetId: string,

    // determines whether a particular consumer is offered an asset or not
    accessPolicyId: string,

    // determines the conditions for initiating a contract negotiation for a particular asset
    contractPolicyId: string
  ) => {
    // create contract definition
    console.log("Creating contract definition");

    const contractDefinitionInput: ContractDefinitionInput = {
      accessPolicyId: accessPolicyId,
      contractPolicyId: contractPolicyId,
      assetsSelector: [
        {
          operandLeft: "id",
          operator: "=",
          operandRight: assetId,
        },
      ],
    };

    const contractDefintionResponse =
      await client.management.contractDefinitions.create(
        contractDefinitionInput
      );
    const contractDefinition = await client.management.contractDefinitions.get(
      contractDefintionResponse.id
    );
    return contractDefinition;
  };

  return {
    client,
    clearEverything,
    createOfferRemoteControlTimeRestricted,
  };
};
