#!/bin/sh

# 0. Register data plane at the DER connector
echo "Register data plane for der-connector"
curl -X POST 'http://der-connector:8181/api/v2/dataplanes' \
  -H 'Content-Type: application/json' \
  -d '{
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
    },
    "@id": "http-pull-provider-dataplane",
    "url": "http://der-connector:9191/api/v1/control/transfer",
    "allowedSourceTypes": ["HttpData"],
    "allowedDestTypes": ["HttpProxy", "HttpData"],
    "properties": {
      "https://w3id.org/edc/v0.0.1/ns/publicApiUrl": "http://der-connector:8185/api/v1/public"
    }
  }' -s | jq
sleep 1

# 1. Add an asset that can be fetched from another connector
echo "-------------"
echo "Creating asset with ID 'wind-turbine-a1'..."
curl -X POST 'http://der-connector:8181/api/v3/assets' \
  -H 'Content-Type: application/json' \
  -d '{
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
    },
    "@id": "wind-turbine-a1",
    "properties": {
      "name": "Wind turbine A1",
      "description": "Access to the control interface for the wind turbine A1",
      "contenttype": "ANLAGENSTEUERUNG",
      "metadata": {
        "mastrNr": "SEE940670228048",
        "contacts": [
          {
            "name": "Jane Doe",
            "role": "In case of technical problems",
            "tel": "+1 123 4567890"
          },
          {
            "name": "John Doe",
            "role": "For questions about the contract",
            "tel": "+1 234 5678901"
          }
        ],
        "interfaceDescription": {
          "oem": "Acme Wind Turbines",
          "technology": "REST API",
          "apiSpec": "http://der-rest-api:5000/apidocs"
        }
      }
    },
    "dataAddress": {
      "type": "HttpData",
      "baseUrl": "http://der-rest-api:5000",
      "proxyPath": "true",
      "proxyQueryParams": "true",
      "proxyBody": "true",
      "proxyMethod": "true"
    }
  }' -s | jq
sleep 1

# 3. Create a policy that limits the access to the participant with ID 'VKEE-0000-0000-0002' 
echo "-------------"
echo "Creating policy with ID 'der-policy'..."
curl -X POST 'http://der-connector:8181/api/v2/policydefinitions' \
  -H 'Content-Type: application/json' \
  -d '{
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      "odrl": "http://www.w3.org/ns/odrl/2/"
    },
    "@id": "der-policy",
    "policy": {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@type": "Set",
      "permission": [
        {
          "action": "use",
          "constraint": {
            "@type": "AtomicConstraint",
            "leftOperand": "identity",
            "operator": "odrl:eq",
            "rightOperand": "VKEE-0000-0000-0002"
          }
        }
      ],
      "prohibition": [],
      "obligation": []
    }
  }' -s | jq
sleep 1



# 3. Create a contract for that asset
echo "-------------"
echo "Creating contract definition with ID 'wind-turbine-a1-contract'..."
curl -X POST 'http://der-connector:8181/api/v2/contractdefinitions' \
  -H 'Content-Type: application/json' \
  -d '{
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
    },
    "@id": "wind-turbine-a1-contract",
    "accessPolicyId": "der-policy",
    "contractPolicyId": "der-policy",
    "assetsSelector": []
  }' -s | jq
sleep 1