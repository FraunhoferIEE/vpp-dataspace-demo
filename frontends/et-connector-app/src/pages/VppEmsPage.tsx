import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Flex,
  Layout,
  List,
  Popconfirm,
  Space,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import ControlDeaForm, {
  ControlDeaFormData,
} from "../components/ControlDeaForm";
import { Facility } from "../types/vpp";

const { Content } = Layout;

const VppEmsPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MY_VPP_DSPACE_SERVICE_URL}/api/facilities`
      );
      const data = await response.json();
      
      setFacilities(data);
      setError(null);
      // Process the data here
    } catch (error) {
      console.error(error);
      setError(new Error("Error while loading the facilities!"));
    }
  };

  // refetch facilities every 1 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateActivePowerPercentOfDea = async (
    facilityId: string,
    active_power_percent: number
  ) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_MY_VPP_DSPACE_SERVICE_URL
        }/api/facilities/${facilityId}/control`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active_power_percent }),
        }
      );

      if (response.ok) {
        message.success("The target feed-in was successfully transmitted");
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      message.error("Error setting the target feed-in!");
    }
  };

  const renderFacility = (facilitiy: Facility) => {
    return (
      <List.Item>
        <Descriptions
          style={{ width: "100%" }}
          layout="horizontal"
          colon
          bordered
          column={1}
        >
          <Descriptions.Item label="Facility ID" span={1}>
            <Typography.Text code>{facilitiy._id}</Typography.Text>
          </Descriptions.Item>

          <Descriptions.Item label="Connection Details">
            <Descriptions column={1} layout="horizontal" colon bordered>
              <Descriptions.Item label="Contract ID">
                <Typography.Text code>
                  {facilitiy.dspace_connection.contract_id}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Endpoint">
                <Typography.Text copyable underline>
                  {facilitiy.dspace_connection.endpoint}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Authorization">
                <Typography.Text ellipsis copyable code>
                  {`${facilitiy.dspace_connection.auth_key}: ${facilitiy.dspace_connection.auth_code}`}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>

          <Descriptions.Item label="Remote Control">
            <Descriptions bordered column={2} layout="vertical">
              <Descriptions.Item label="Last Reading">
                {facilitiy.latest_data_timestamp ? (
                  <pre>{JSON.stringify(facilitiy.latest_data, null, 2)}</pre>
                ) : (
                  "No data available"
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Change feed-in">
                <ControlDeaForm
                  onSubmit={async (values: ControlDeaFormData) => {
                    const { active_power_percent } = values;
                    updateActivePowerPercentOfDea(
                      facilitiy._id,
                      active_power_percent
                    );
                  }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>
        </Descriptions>
      </List.Item>
    );
  };

  const renderError = () => {
    if (error) {
      return <Alert message={error.message} type="error" />;
    }
    return null;
  };

  return (
    <Content>
      <Flex vertical gap="middle">
        <List
          header={
            <Flex vertical gap={"middle"}>
              <Flex justify="space-between" align="center">
                <Typography>
                  <Typography.Title level={3}>EMS overview:</Typography.Title>
                  <Typography.Text type="secondary">
                    Number of facilities configured: {facilities.length}
                  </Typography.Text>
                </Typography>
                <Typography.Text type="secondary">
                  Last refresh:{" "}
                  {new Date().toLocaleDateString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography.Text>
              </Flex>
              {renderError()}
            </Flex>
          }
          dataSource={facilities}
          renderItem={(facilitiy) => renderFacility(facilitiy)}
        />
      </Flex>

      <Divider />

      <Space>
        <Popconfirm
          title={
            <>
              <Typography.Text type="danger">Danger!</Typography.Text>
              <Typography.Paragraph>
                Do you really want to remove all facilities from the EMS?
              </Typography.Paragraph>
            </>
          }
          onConfirm={async () => {
            try {
              const response = await fetch(
                `${
                  import.meta.env.VITE_MY_VPP_DSPACE_SERVICE_URL
                }/api/facilities`,
                {
                  method: "DELETE",
                }
              );

              if (response.ok) {
                setFacilities([]);
              }
            } catch (error) {
              message.error("Fehler beim Löschen der Anlagen");
              console.error(error);
            }
          }}
        >
          <Button type="primary" danger>
            Remove all facilities
          </Button>
        </Popconfirm>
      </Space>
    </Content>
  );
};

export default VppEmsPage;
