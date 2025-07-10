import { Button, Form, Select, Space, Typography } from "antd";
import React from "react";

const { Option, OptGroup } = Select;

interface AddToVppEmsFormProps {
  onSubmit: (values: AddToMicrovppFormData) => Promise<void>;
}

export type AddToMicrovppFormData = {
  driverName: string;
};

const AddToVppEmsForm: React.FC<AddToVppEmsFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values: AddToMicrovppFormData) => {
    onSubmit(values);
  };

  return (
    <Form
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      onFinish={onFinish}
      colon
      initialValues={{ driverName: "default" }}
    >
      <Form.Item name={"driverName"} label="Select driver" required>
        <Select placeholder="Treiber auswählen" style={{ width: "100%" }}>
          <OptGroup label="Generic">
            <Option value="default">
              <Typography.Text>default</Typography.Text>
              {" - "}
              <Typography.Text type="secondary">
                {"/api/handlers/edr-receiver?driver=default"}
              </Typography.Text>
            </Option>
          </OptGroup>
          <OptGroup label="Wind">
            <Option disabled value="siemens">
              Siemens
            </Option>
            <Option disabled value="vestats">
              Vestas
            </Option>
          </OptGroup>
          <OptGroup label="Solar">
            <Option disabled value="sma">
              SMA
            </Option>
          </OptGroup>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Connect
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddToVppEmsForm;
