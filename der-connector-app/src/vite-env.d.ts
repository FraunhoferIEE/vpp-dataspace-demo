/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Connector URLs
  readonly VITE_MY_EDC_CONNECTOR_DEFAULT_URL: string;
  readonly VITE_MY_EDC_CONNECTOR_MANAGEMENT_URL: string;
  readonly VITE_MY_EDC_CONNECTOR_PROTOCOL_URL: string;
  readonly VITE_MY_EDC_CONNECTOR_CONTROL_URL: string;
  readonly VITE_MY_EDC_CONNECTOR_PUBLIC_URL: string;

  // Own Participant ID. Displayed in 'Teilnehmerdaten' card
  readonly VITE_MY_VKEE_PARTICIPANT_ID: string;

  // URL of the REST API of the DEA it will be shared
  readonly VITE_MY_DEA_REST_API: string;

  // Use to display the name of the user in the 'Hallo, <name>' text
  readonly VITE_MY_DISPLAY_NAME: string;
  readonly VITE_MY_DISPLAY_COMPANY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
