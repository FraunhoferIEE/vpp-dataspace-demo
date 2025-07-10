#!/bin/bash

CONNECTOR_HOSTNAME="windpark-connector"
MANAGEMENT_CTX_PORT=8181
CONTROL_CTX_PORT=9191
PUBLIC_CTX_PORT=8185

ASSET_ID="urn:vkee:asset:windpark-api"
POLICY_ID="urn:vkee:policy:empty"
CONTRACT_DEFINITION_ID="urn:vkee:contract-definition:use-windpark-api"
BASE_URL="http://windpark-rest-api:5000/"

# Used to create a policy that restricts API access
# Only participant agents where the participantId matches this value will be allowed to access the API
PARTICIPANT_ID_CONSUMER="urn:vpp-company"


echo "Registering a dataplane..."
curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/dataplanes" \
--header 'Content-Type: application/json' \
--data-raw "{
  \"@context\": {
    \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
  },
  \"@id\": \"http-pull-dataplane\",
  \"url\": \"http://${CONNECTOR_HOSTNAME}:${CONTROL_CTX_PORT}/control/transfer\",
  \"allowedSourceTypes\": [\"HttpData\"],
  \"allowedDestTypes\": [\"HttpProxy\", \"HttpData\"],
  \"properties\": {
    \"https://w3id.org/edc/v0.0.1/ns/publicApiUrl\": \"http://${CONNECTOR_HOSTNAME}:${PUBLIC_CTX_PORT}/public/\"
  }
}" -s | jq

sleep 1

echo "-------------------"
echo "Creating asset with ID ${ASSET_ID} ..."
curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v3/assets" \
--header "Content-Type: application/json" \
--data-raw "{
    \"@context\": {
        \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
    },
    \"@id\": \"${ASSET_ID}\",
    \"properties\": {
        \"name\": \"Windpark API\",
        \"contenttype\": \"application/json\",
        \"foo\": \"bar\"
    },
    \"dataAddress\": {
        \"type\": \"HttpData\",
        \"name\": \"Windpark API\",
        \"baseUrl\": \"${BASE_URL}\",
        \"proxyPath\": \"true\",
        \"proxyQueryParams\": \"true\",
        \"proxyBody\": \"true\",
        \"proxyMethod\": \"true\"
    }
}" -s | jq
sleep 1

echo "-------------------"
echo "Creating policy with ID ${POLICY_ID} ..."
curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/policydefinitions" \
--header "Content-Type: application/json" \
--data-raw "{
  \"@context\": {
    \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\",
    \"odrl\": \"http://www.w3.org/ns/odrl/2/\"
  },
  \"@id\": \"${POLICY_ID}\",
  \"policy\": {
    \"@context\": \"http://www.w3.org/ns/odrl.jsonld\",
    \"@type\": \"Set\",
    \"permission\": [
        {
            \"action\": \"use\",
            \"constraint\": {
                \"@type\": \"AtomicConstraint\",
                \"leftOperand\": \"identity\",
                \"operator\": \"odrl:eq\",
                \"rightOperand\": \"${PARTICIPANT_ID_CONSUMER}\"
            }
        }
    ],
    \"prohibition\": [],
    \"obligation\": []
  }
}" -s | jq
sleep 1


echo "-------------------"
echo "Create contract definition with ID ${CONTRACT_DEFINITION_ID} ..."

curl --location "http://${CONNECTOR_HOSTNAME}:${MANAGEMENT_CTX_PORT}/management/v2/contractdefinitions" \
--header "Content-Type: application/json" \
--data-raw "{
    \"@context\": {
      \"@vocab\": \"https://w3id.org/edc/v0.0.1/ns/\"
    },
    \"@id\": \"${CONTRACT_DEFINITION_ID}\",
    \"accessPolicyId\": \"${POLICY_ID}\",
    \"contractPolicyId\": \"${POLICY_ID}\",
    \"assetsSelector\": []
  }" -s | jq

