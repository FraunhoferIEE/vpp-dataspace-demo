import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Space, message } from "antd";
import { useMetadata } from "../hooks/useMetadata";
import { Contact, InterfaceDescription } from "../types/dataspace";
interface PageFooterProps {}

export type MetadataEditorFormData = {
  mastrNr: string;
  contacts: Contact[];
  interfaceDescription: InterfaceDescription;
};

const MetadataEditor: React.FC<PageFooterProps> = () => {
  const { meta, setMeta, defaultMeta } = useMetadata();

  const handleSave = async (values: MetadataEditorFormData) => {
    setMeta(values);
    message.success("Metadata saved");
  };

  const handleResetToDefault = () => {
    setMeta(defaultMeta);
    window.location.reload();
  };

  return (
    <Flex gap={"middle"} vertical>
      <Form
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          mastrNr: meta?.mastrNr,
          contacts: meta?.contacts,
          interfaceDescription: meta?.interfaceDescription,
        }}
      >


        <Form.Item label="Contact Person" required>
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <Flex vertical gap={"small"}>
                {fields.map((field) => (
                  <Card
                    size="small"
                    key={field.key}
                    bordered
                    title={`Contact #${field.key + 1}`}
                    extra={[
                      <CloseOutlined
                        key={`close-${field.key}`}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />,
                    ]}
                  >
                    <Form.Item
                      required
                      label="Name"
                      name={[field.name, "name"]}
                    >
                      <Input required />
                    </Form.Item>

                    <Form.Item
                      required
                      label="Role/Responsibility"
                      name={[field.name, "role"]}
                    >
                      <Input.TextArea required />
                    </Form.Item>

                    <Form.Item
                      required
                      label="Phone Number"
                      name={[field.name, "tel"]}
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Contact
                </Button>
              </Flex>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          label="Interface Description"
          required
          name={"interfaceDescription"}
        >
          <Flex vertical gap={"small"}>
            <Card>
              <Form.Item
                label="Manufacturer"
                required
                name={["interfaceDescription", "oem"]}
              >
                <Input required />
              </Form.Item>

       

              <Form.Item
                label="Open API Specification"
                required
                name={["interfaceDescription", "apiSpec"]}
              >
                <Input required />
              </Form.Item>
            </Card>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Metadata
            </Button>
            <Button type="default" onClick={handleResetToDefault}>
              Reset to Default
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default MetadataEditor;
