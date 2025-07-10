import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";

export const useEdcConnector = () => {
  const client: EdcConnectorClient = new EdcConnectorClient.Builder()
    .defaultUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_DEFAULT_URL)
    .managementUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_MANAGEMENT_URL)
    .protocolUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_PROTOCOL_URL)
    .controlUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_CONTROL_URL)
    .publicUrl(import.meta.env.VITE_MY_EDC_CONNECTOR_PUBLIC_URL)
    .build();

  return {
    client,
  };
};
