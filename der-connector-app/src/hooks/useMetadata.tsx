import { useState } from "react";
import { EnergySystemMetadata, VkeeAngebotstyp } from "../types/dataspace";

export const useMetadata = () => {
  const defaultMeta: EnergySystemMetadata = {
    mastrNr: "SEE940670228048",
    contacts: [
      {
        name: "Jane Doe",
        role: "In case of technical problems",
        tel: "+1 123 4567890",
      },
      {
        name: "John Doe",
        role: "For questions about the contract",
        tel: "+1 234 5678901",
      },
    ],
    interfaceDescription: {
      oem: "Acme Wind Turbines",
      technology: "REST API",
      apiSpec: "http://der-rest-api:5000/apidocs",
    },
  };

  const [meta, setMeta] = useState<EnergySystemMetadata>(defaultMeta);

  const defaultName = "Wind turbine A1";
  const defaultDescription =
    "Access to the control interface for the wind turbine A1";
  const defaultContenttype = VkeeAngebotstyp.ANLAGENSTEUERUNG;

  return {
    defaultName,
    defaultContenttype,
    defaultDescription,
    defaultMeta,
    meta,
    setMeta,
  };
};
