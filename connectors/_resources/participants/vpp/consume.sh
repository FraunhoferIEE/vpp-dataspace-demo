#!/bin/bash

# Check if the first command line argument is provided
#if [ -z "$1" ]
#then
#  echo "Error: OTHER_CONNECTOR_DSP_URL is required as a command line argument. Example: ./consume.sh http://windpark-connector:8282/protocol"
#  exit 1
#fi

# Use the first command line argument as the CONNECTOR_HOSTNAME
#OTHER_CONNECTOR_DSP_URL=$1

OTHER_CONNECTOR_DSP_URL="http://windpark-connector:8282/protocol"

CONNECTOR_HOSTNAME="vpp-connector"
MANAGEMENT_CTX_PORT=8181

# The following values are specific to the Windpark API
ASSIGNER="urn:windpark-company"
ASSET_ID="urn:vkee:asset:windpark-api"

# This is where the EDR will be sent to once a data transfer is initiated
RECEIVER_HTTP_ENDPOINT="http://vpp-dspace-service:5000/api/handlers/edr-receiver"

echo "Requesting catalog and extracting PolicyId of asset ${ASSET_ID}..."

CATALOG=$(curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/catalog/request" \
--header "Content-Type: application/json" \
--data-raw "{
    \"@context\": {
        \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
    },
    \"counterPartyAddress\": \"${OTHER_CONNECTOR_DSP_URL}\",
    \"protocol\": \"dataspace-protocol-http\",
    \"querySpec\": {
        \"offset\": 0,
        \"limit\": 50,
        \"filterExpression\": {
            \"@context\": {
                \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
            },
            \"@type\": \"Criterion\",
            \"operandLeft\": \"id\",
            \"operator\": \"=\",
            \"operandRight\": \"${ASSET_ID}\"
        }
    }
}" -s | jq .) && echo "$CATALOG"

# Extract the PolicyId from the catalog and store it in the POLICY_ID variable and print it
POLICY_ID=$(echo "$CATALOG" | jq -r '."dcat:dataset"."odrl:hasPolicy"."@id"')
echo "$POLICY_ID"

# Extract permission from the policy
PERMISSION=$(echo "$CATALOG" | jq -r '."dcat:dataset"."odrl:hasPolicy"."odrl:permission"')
echo "Extracted PERMISSION: $PERMISSION"

# Escape the double quotes in the permission string
PERMISSION=$(echo "$PERMISSION" | jq -c .)
echo "Escaped PERMISSION: $PERMISSION"

sleep 2

echo "-------------------"
echo "Initiating a contract negotiation..."

CONTRACT_NEGOTIATION_ID=$(curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/contractnegotiations" \
--header "Content-Type: application/json" \
--data-raw "{
    \"@context\": {
        \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
    },
    \"@type\": \"ContractRequest\",
    \"counterPartyAddress\": \"${OTHER_CONNECTOR_DSP_URL}\",
    \"protocol\": \"dataspace-protocol-http\",
    \"policy\": {
        \"@context\": \"http://www.w3.org/ns/odrl.jsonld\",
        \"@id\": \"${POLICY_ID}\",
        \"@type\": \"Offer\",
        \"odrl:permission\": ${PERMISSION},
        \"assigner\": \"${ASSIGNER}\",
        \"target\": \"${ASSET_ID}\"
    }
}" -s | jq -r '."@id"') && echo "$CONTRACT_NEGOTIATION_ID"

sleep 2

echo "-------------------"
echo "Requesting contract and extracting ContractId..."

CONTRACT_AGREEMENT_ID=$(curl -X GET "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/contractnegotiations/${CONTRACT_NEGOTIATION_ID}" \
    -H 'Content-Type: application/json' \
    -s | jq -r '."contractAgreementId"') && echo "$CONTRACT_AGREEMENT_ID"

echo "-------------------"

sleep 2


echo "Starting the data transfer..."
TRANSFER_PROCESS_ID=$(curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/transferprocesses" \
  --header "Content-Type: application/json" \
  --data-raw "{
      \"@context\": {
          \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
      },
      \"@type\": \"TransferRequest\",
      \"protocol\": \"dataspace-protocol-http\",
      \"assetId\": \"${ASSET_ID}\",
      \"contractId\": \"${CONTRACT_AGREEMENT_ID}\",
      \"dataDestination\": {
          \"@type\": \"DataAddress\",
          \"type\": \"HttpProxy\"
      },
      \"counterPartyAddress\": \"${OTHER_CONNECTOR_DSP_URL}\",
      \"connectorId\": \"participant-1\",
      \"privateProperties\": {
          \"receiverHttpEndpoint\": \"${RECEIVER_HTTP_ENDPOINT}\"
      }
  }" -s | jq -r '."@id"') && echo "$TRANSFER_PROCESS_ID"
