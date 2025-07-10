import { Policy } from "./dataspace";

export interface OfferFromFederatedCatalog {
  id: string;
  name: string;
  description?: string;
  origin: Origin;
  forNegotiation: ForNegotiation;
  metadata?: Metadata;
}

export interface Origin {
  connectorUrl: string;
  displayName: string;
  participantId: string;
}

export interface ForNegotiation {
  assetId: string;
  counterpartyUrl: string;
  offerId: string;
  policy: Policy;
}

export interface Origin {
  displayName: string;
  participantId: string;
  connectorUrl: string;
}

export interface Metadata {
  tags: string[];
  origin: Origin;
  description: string;
}

export interface VkeeOffer {
  name: string;
  contenttype?: string;
  description?: string;
  assetId: string;
  participantId: string;
  connectorUrl: string;
}
