export interface Facility {
  _id: string;
  name: string;
  dspace_connection: EndpointDataReference;
  latest_data?: never;
  latest_data_timestamp?: string;
}

export interface EndpointDataReference {
  auth_code: string;
  auth_key: string;
  contract_id: string;
  endpoint: string;
}
