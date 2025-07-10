/* eslint-disable react-hooks/exhaustive-deps */
import {
  ContractAgreement,
  Dataset,
  Policy,
} from "@think-it-labs/edc-connector-client";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Layout,
  Popover,
  Timeline,
  Typography,
  message,
} from "antd";

import { CheckCircleTwoTone, InfoCircleTwoTone } from "@ant-design/icons";

import { TimelineItemProps } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddToVppEmsForm, {
  AddToMicrovppFormData,
} from "../components/AddToVppEmsForm";
import DatasetMetadataDescription from "../components/DatasetMetadataDescription";
import { useEdcConnector } from "../hooks/useEdcConnector";
import { ContractNegotiationState } from "../types/dataspace";

const { Content } = Layout;

interface NegotiationPageProps {}

const NegotiationPage: React.FC<NegotiationPageProps> = () => {
  const { client } = useEdcConnector();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const datasetId = searchParams.get("datasetId");
  const counterPartyId = searchParams.get("counterPartyId");
  const counterPartyAddress = searchParams.get("counterPartyAddress");

  const [dataset, setDataset] = useState<Dataset | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const [negotiationId, setNeotiationId] = useState<string | null>(null);
  const [transferProcessId, setTransferProcessId] = useState<string | null>(
    null
  );

  const [contactNegotiationState, setContactNegotiationState] =
    useState<ContractNegotiationState | null>(null);

  const [contractAgreement, setContractAgreement] =
    useState<ContractAgreement | null>(null);

  const [timelineItems, setTimelineItems] = useState<TimelineItemProps[]>([]);

  const [negotiationStarted, setNegotiationStarted] = useState(false);

  const startNegotiation = async () => {
    if (dataset !== null) {
      setNegotiationStarted(true);

      // sleep for 1 seconds
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      // extract policy from the dataset
      const policy = dataset[
        "http://www.w3.org/ns/odrl/2/hasPolicy"
      ][0] as Policy;
      // set target is the ID of the dataset we want to negotiate
      policy["http://www.w3.org/ns/odrl/2/target"] = {
        "@id": datasetId,
      };
      // assigner is the ID of the dataset owner
      policy["http://www.w3.org/ns/odrl/2/assigner"] = {
        "@id": counterPartyId,
      };

      setTimelineItems((timelineItems) => [
        ...timelineItems,
        { label: "Starting negotiation..." },
      ]);

      // Create Negotiation Request
      const negotiationRequest = {
        policy: policy!,
        counterPartyAddress: counterPartyAddress!,
      };

      // Initiate the negotiation
      const negotiation = await client.management.contractNegotiations.initiate(
        negotiationRequest
      );

      //  extract the negotiation ID
      setNeotiationId(negotiation["@id"]);
    }
  };

  const reset = () => {
    setNegotiationStarted(false);
    setError(null);
    setNeotiationId(null);
    setContactNegotiationState(null);
    setContractAgreement(null);
    setTimelineItems([]);
    setDataset(null);
    setTransferProcessId(null);
  };

  // negotiate the dataset
  useEffect(() => {
    if (!datasetId || !counterPartyId || !counterPartyAddress) {
      setError(new Error("Missing parameters"));
      return;
    }

    const neogiateDataset = async () => {
      reset();

      try {
        const catalog = await client.management.catalog.request({
          counterPartyAddress: counterPartyAddress!,
        });

        const datasets = catalog.datasets.filter((dataset) => {
          return dataset["@id"] === datasetId;
        });
        if (datasets.length === 0) {
          throw new Error("Dataset not found in catalog ");
        } else if (datasets.length > 1) {
          throw new Error("Multiple datasets found in catalog");
        } else {
          setDataset(datasets[0]);
        }

        setTimelineItems(() => [
          {
            label: "Received metadata",
            position: "right",
            dot: <InfoCircleTwoTone />,
          },
        ]);
      } catch (error) {
        setError(error as Error);
        console.error(error);
      }
    };

    neogiateDataset();
  }, [datasetId, counterPartyId, counterPartyAddress]);

  // monitor the negotiation state
  useEffect(() => {
    if (!negotiationId) {
      return;
    }

    const monitorContractNeotiation = setInterval(async () => {
      try {
        const negotiationStateResponse =
          await client.management.contractNegotiations.getState(negotiationId);

        setContactNegotiationState(
          negotiationStateResponse.state as ContractNegotiationState
        );

        setTimelineItems((timelineItems) => [
          ...timelineItems,
          {
            label: `${negotiationStateResponse.state}`,
            position: "right",
          },
        ]);

        switch (negotiationStateResponse.state) {
          case "REQUESTED":
            console.log("Negotiation requested");
            break;
          case "OFFERED":
            console.log("Negotiation offered");
            break;
          case "ACCEPTED":
            console.log("Negotiation accepted");
            break;
          case "AGREED":
            console.log("Negotiation agreed");
            break;
          case "VERIFIED":
            console.log("Negotiation verified");
            break;
          case "FINALIZED":
            console.log("Negotiation finalized");
            clearInterval(monitorContractNeotiation);

            setTimelineItems((timelineItems) => [
              ...timelineItems,
              {
                label: "Negotiation successful",
                position: "left",
                dot: <CheckCircleTwoTone />,
              },
            ]);

            // set contract agreement
            setContractAgreement(
              await client.management.contractNegotiations.getAgreement(
                negotiationId
              )
            );

            break;
          case "TERMINATED":
            console.log("Negotiation terminated");
            clearInterval(monitorContractNeotiation);
            break;
        }
      } catch (error) {
        console.error(error);
        setError(error as Error);
      }
    }, 1000);

    return () => {
      clearInterval(monitorContractNeotiation);
    };
  }, [negotiationId]);

  const onAdd = async (values: AddToMicrovppFormData) => {
    if (!contractAgreement) {
      console.error("Contract agreement not found");
      return;
    }
    const driverName = values.driverName;
    if (!driverName) {
      console.error("Driver not found");
      return;
    }

    try {
      const transferProcessesInput = {
        assetId: datasetId!,
        counterPartyAddress: counterPartyAddress!,
        contractId: contractAgreement["@id"],
        dataDestination: {
          "@type": "DataAddress",
          type: "HttpProxy",
        },
        transferType: "TransferRequest",
        privateProperties: {
          receiverHttpEndpoint:
            import.meta.env.VITE_MY_VPP_DSPACE_SERVICE_URL +
            `/api/handlers/edr-receiver?driver=${driverName}`,
        },
      };

      const transferResponse =
        await client.management.transferProcesses.initiate(
          transferProcessesInput
        );

      setTransferProcessId(transferResponse["@id"]);
      console.log("Transfer process initiated", transferResponse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!transferProcessId) {
      return;
    }

    const monitorTransferProcess = setInterval(async () => {
      try {
        const transferProcessState =
          await client.management.transferProcesses.getState(transferProcessId);

        console.log("Transfer process state", transferProcessState);

        // if data source is infinit the transfer process will stay in the started state until it is terminated
        switch (transferProcessState.state) {
          case "PROVISIONING":
            console.log("Transfer process provisioning");
            break;
          case "PROVISIONED":
            console.log("Transfer process provisioned");
            break;
          case "REQUESTING":
            console.log("Transfer process requesting");
            break;
          case "STARTED":
            console.log("Transfer process started");
            message.success("Transfer process started");
            clearInterval(monitorTransferProcess);
            navigate("/vppems");
            break;
          case "COMPLETED":
            console.log("Transfer process completed");
            clearInterval(monitorTransferProcess);
            break;
          case "TERMINATED":
            console.log("Transfer process terminated");
            clearInterval(monitorTransferProcess);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    }, 1000);

    return () => {
      clearInterval(monitorTransferProcess);
    };
  }, [transferProcessId]);

  const renderError = () => {
    if (error) {
      return (
        <Alert
          message={error.message}
          type="error"
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Neu laden
            </Button>
          }
        />
      );
    }
    return null;
  };

  const renderMetadata = () => {
    return (
      <>
        <Typography.Title level={3}>Meta data</Typography.Title>
        <DatasetMetadataDescription dataset={dataset} />
      </>
    );
  };

  const renderProgress = () => {
    return (
      <Col>
        <Flex vertical gap="middle">
          <Typography.Title level={3}>Negotiation</Typography.Title>

          <Card title="Negotiation process" style={{ width: "100%" }}>
            <Timeline
              style={{ width: "100%" }}
              items={timelineItems}
              pending={
                contactNegotiationState !== null &&
                contactNegotiationState != ContractNegotiationState.FINALIZED
              }
            />
            {contactNegotiationState !== ContractNegotiationState.FINALIZED && (
              <Button
                type="primary"
                loading={negotiationStarted}
                block
                onClick={startNegotiation}
              >
                Start negotiation
              </Button>
            )}

            {contractAgreement !== null && (
              <Flex gap="middle" vertical>
                <Alert
                  showIcon
                  message={
                    <Flex gap="middle">
                      <Typography.Text strong>Contract signed!</Typography.Text>
                    </Flex>
                  }
                  description={
                    <Flex gap="middle" vertical>
                      <Typography.Paragraph>
                        A{" "}
                        <Popover
                          content={
                            <pre>
                              {JSON.stringify(contractAgreement, null, 2)}
                            </pre>
                          }
                        >
                          <Typography.Text code>
                            ContractAgreement
                          </Typography.Text>
                        </Popover>{" "}
                        has been confirmed and signed by both parties.
                        Connection information and authorization codes for
                        accessing the control interface can now be retrieved. To
                        do this, a transfer process must be initiated via the
                        connector.
                      </Typography.Paragraph>

                      <AddToVppEmsForm onSubmit={onAdd} />
                    </Flex>
                  }
                  type="success"
                />
              </Flex>
            )}
          </Card>
        </Flex>
      </Col>
    );
  };

  return (
    <Content>
      <Flex vertical gap="middle">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate(`/dataspace`)}>
            Dataspace
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pair with EMS</Breadcrumb.Item>
        </Breadcrumb>

        <Typography.Title level={3}>Offer details</Typography.Title>

        <Descriptions bordered layout="horizontal">
          <Descriptions.Item label="Asset-ID">{datasetId}</Descriptions.Item>
          <Descriptions.Item label="Provider Particpant-ID">
            {counterPartyId}
          </Descriptions.Item>
          <Descriptions.Item label="Provider DSP-URL">
            {counterPartyAddress}
          </Descriptions.Item>
        </Descriptions>

        <Flex vertical gap="middle">
          {renderError()}
          {renderMetadata()}
          {renderProgress()}
        </Flex>
      </Flex>
    </Content>
  );
};

export default NegotiationPage;
