export interface DcatCatalog {
  "@id": string;
  "@type": string;
  "https://w3id.org/dspace/v0.8/participantId": string;
  "http://www.w3.org/ns/dcat#dataset": Dataset | Dataset[];
  "http://www.w3.org/ns/dcat#service": DataService | DataService[];
  originator: string;
  participantId: string;

  "@context": Record<string, string>;
}

export interface Format {
  "@id": string;
}

export interface Distribution {
  "@type": string;
  "http://purl.org/dc/terms/format": Format;
  "http://www.w3.org/ns/dcat#accessService": string;
}

export interface Policy {
  "@id": string;
  "@type": string;
  "odrl:permission": unknown[];
  "odrl:prohibition": unknown[];
  "odrl:obligation": unknown[];
}

export interface Dataset {
  "@id": string;
  "@type": string;
  "odrl:hasPolicy": Policy;
  "http://www.w3.org/ns/dcat#distribution": Distribution[];
  name: string;
  id: string;
  [propertyName: string]: unknown;
}

export interface DataService {
  "@id": string;
  "@type": string;
  "http://purl.org/dc/terms/terms": string;
  "http://purl.org/dc/terms/endpointUrl": string;
}

export enum ContractNegotiationState {
  REQUESTED = "REQUESTED",
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  AGREED = "AGREED",
  VERIFIED = "VERIFIED",
  FINALIZED = "FINALIZED",
  TERMINATED = "TERMINATED",
}

export interface EnergySystemMetadata {
  mastrNr: string;
  contacts: Contact | Contact[];
  interfaceDescription: InterfaceDescription;
}

export interface Contact {
  name: string;
  tel: string;
  role: string;
}

export interface InterfaceDescription {
  oem: string;
  technology: string;
  apiSpec?: object | string;
}

export enum VkeeAngebotstyp {
  ANLAGENSTEUERUNG = "ANLAGENSTEUERUNG",
  SERVICE = "SERVICE",
}
