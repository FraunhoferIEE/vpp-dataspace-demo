import { Dataset } from "@think-it-labs/edc-connector-client";
import {
  Alert,
  Button,
  Descriptions,
  List,
  Modal,
  Skeleton,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Contact, VkeeAngebotstyp } from "../types/dataspace";

interface DatasetDescriptionProps {
  dataset: Dataset | null;
}

const DatasetDescription: React.FC<DatasetDescriptionProps> = ({ dataset }) => {
  const [showModal, setShowModal] = useState(false);

  const renderModal = () => {
    return (
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <pre>{JSON.stringify(dataset, null, 2)}</pre>
      </Modal>
    );
  };

  const renderModalButton = () => {
    return (
      <Button size="small" onClick={() => setShowModal(true)}>
        JSON-LD anzeigen
      </Button>
    );
  };

  const renderGenericDescription = () => {
    return (
      <>
        {renderModal()}
        <Alert
          action={renderModalButton()}
          message={
            <Typography.Text strong>
              {"Unbekannter Angebotstyp! "}
            </Typography.Text>
          }
          type="warning"
        />
      </>
    );
  };

  const renderAnlagensteuerungDescription = () => {
    if (!dataset) {
      return <Skeleton active />;
    }

    const nsPrefix = "https://w3id.org/edc/v0.0.1/ns/";

    console.log(dataset);

    const meta = dataset[nsPrefix + "metadata"][0];
    const contacts = meta[nsPrefix + "contacts"].map((c: never) => {
      const name = c[nsPrefix + "name"][0]["@value"];
      const role = c[nsPrefix + "role"][0]["@value"];
      const tel = c[nsPrefix + "tel"][0]["@value"];
      return { name, role, tel };
    });

    const interfaceDescription = meta[nsPrefix + "interfaceDescription"].map(
      (i: never) => {
        const apiSpec = i[nsPrefix + "apiSpec"][0]["@value"];
        const oem = i[nsPrefix + "oem"][0]["@value"];
        const technology = i[nsPrefix + "technology"][0]["@value"];
        return { apiSpec, oem, technology };
      }
    )[0];

    return (
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Interface">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="OEM">
              <Typography.Text>{interfaceDescription.oem}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Open API Specification">
              <Space direction="vertical">
                <Typography.Text>
                  <Link to={`http://localhost:5000/apidocs`}>
                    {`${interfaceDescription.apiSpec}`}
                  </Link>
                </Typography.Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Descriptions.Item>

        <Descriptions.Item label="Contracts">
          <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={(contact: Contact) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    title={contact.name}
                    description={contact.role}
                  />
                  <Typography.Text>
                    <a href={`tel:${contact.tel}`}>{contact.tel}</a>
                  </Typography.Text>
                </List.Item>
              );
            }}
          ></List>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  if (!dataset) {
    return <Skeleton active />;
  }

  switch (dataset.optionalValue<VkeeAngebotstyp>("edc", "contenttype")) {
    case VkeeAngebotstyp.ANLAGENSTEUERUNG:
      return renderAnlagensteuerungDescription();
    default:
      return renderGenericDescription();
  }
};

export default DatasetDescription;
