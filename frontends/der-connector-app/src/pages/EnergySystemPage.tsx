import {
  Alert,
  Card,
  Divider,
  Flex,
  Layout,
  Statistic,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import MetadataEditor from "../components/MetadataEditor";
import { EnergySystemData } from "../types/dea";

const { Content } = Layout;

const EnergySystemPage: React.FC = () => {
  const [energySystemData, setEnergySystemData] =
    useState<EnergySystemData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MY_DEA_REST_API}/api/data`
      );
      const data = await response.json();

      const { ACTIVE_POWER } = data;

      // workaround for missing data because of swapping emulator
      data.ACTIVE_POWER_SET_POINT_PERCENT = ACTIVE_POWER;
      data.AVAILABLE_ACTIVE_POWER = 500;
      data.ACTIVE_POWER = data.AVAILABLE_ACTIVE_POWER * (ACTIVE_POWER / 100);

      
      // calculate available active power based on supplied installed nominal active power
      // and active power set point percent

      setEnergySystemData(data);
      setError(null);
      // Process the data here
    } catch (error) {
      console.error(error);
      setError(new Error("Fehler beim Laden der Daten von der Anlage"));
    }
  };

  // refetch facilities every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderError = () => {
    if (error) {
      return <Alert message={error.message} type="error" />;
    }
    return null;
  };

  return (
    <Content>
      {renderError()}

      <Flex vertical gap="middle">
        <Typography.Title level={3}>Plant operation data</Typography.Title>
        <Flex wrap gap="middle">
          <Card>
            <Statistic
              loading={energySystemData === null}
              title="Available active power"
              value={energySystemData?.AVAILABLE_ACTIVE_POWER}
              precision={0}
              suffix="kW"
            />
          </Card>

          <Card>
            <Statistic
              loading={energySystemData === null}
              title="Target feed-in"
              value={energySystemData?.ACTIVE_POWER_SET_POINT_PERCENT}
              precision={0}
              suffix="%"
            />
          </Card>

          <Card>
            <Statistic
              loading={energySystemData === null}
              title="Fed-in power"
              value={energySystemData?.ACTIVE_POWER}
              precision={0}
              suffix="kW"
            />
          </Card>
        </Flex>
      </Flex>

      <Divider />

      <Flex vertical gap="middle">
        <Typography.Title level={3}>Plant meta data</Typography.Title>
        <MetadataEditor />
      </Flex>
    </Content>
  );
};

export default EnergySystemPage;
