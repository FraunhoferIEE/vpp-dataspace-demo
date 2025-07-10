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

  // URL of the dspace service from the MicroVPP. This service will handle the EDR response after starting a transfer process
  readonly VITE_MY_VPP_DSPACE_SERVICE_URL: string;

  // Use to display the name of the user in the 'Hallo, <name>' text
  readonly VITE_MY_DISPLAY_NAME: string;

  readonly VITE_MY_DISPLAY_COMPANY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
