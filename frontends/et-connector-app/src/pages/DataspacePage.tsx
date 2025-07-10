import { SettingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Layout,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import FederatedCatalogExplorer from "../components/FederatedCatalogExplorer";
import { useEdcConnector } from "../hooks/useEdcConnector";

const { Content } = Layout;

const DataspacePage: React.FC = () => {
  const { client } = useEdcConnector();

  const [participantId, setParticipantId] = useState<string | undefined>();
  const [connectorUrl, setConnectorUrl] = useState<string | undefined>();

  useEffect(() => {
    const getOwnCatalog = async () => {
      // get own catalog
      const catalog = await client.management.catalog.request({
        counterPartyAddress: import.meta.env.VITE_MY_EDC_CONNECTOR_PROTOCOL_URL,
      });

      setParticipantId(catalog.mandatoryValue<string>("edc", "participantId"));
      setConnectorUrl(
        catalog["http://www.w3.org/ns/dcat#service"][0][
          "http://purl.org/dc/terms/endpointUrl"
        ][0]["@value"]
      );
    };
    getOwnCatalog();
  }, [client]);

  return (
    <Content>
      <Flex vertical wrap gap="small">
          <Card>
            <Typography.Title level={2}>
              {`Hello, ${import.meta.env.VITE_MY_DISPLAY_NAME}`}
            </Typography.Title>

            <Typography.Paragraph>
              <Typography.Text type="secondary">
                Welcome to the Energy Data Space. Here you can find your
                connection information and search for data and service offers.
              </Typography.Text>
            </Typography.Paragraph>
          </Card>

        <Card
          title="Participant details"
          extra={
            <Button disabled size="small" icon={<SettingOutlined />}>
              Settings
            </Button>
          }
        >
          <Flex vertical gap="small">
            <Typography.Text type="secondary">
              Share your ID with other dataspace participants so that they can
              grant you access to offers with limited visibility.
            </Typography.Text>
            <Descriptions colon bordered>
              <Descriptions.Item label="Your Participant-ID:">
                <Typography.Text code copyable>
                  {participantId}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="DSP-URL of your Connector:">
                <Typography.Text copyable underline>
                  {connectorUrl}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>
          </Flex>
        </Card>

        <Card>
          <FederatedCatalogExplorer />
        </Card>
      </Flex>
    </Content>
  );
};

export default DataspacePage;
