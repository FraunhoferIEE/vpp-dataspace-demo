import { Button, Form, InputNumber } from "antd";
import React from "react";

interface ControlDeaFormProps {
  onSubmit: (values: ControlDeaFormData) => Promise<void>;
}

export type ControlDeaFormData = {
  active_power_percent: number;
};

const ControlDeaForm: React.FC<ControlDeaFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values: ControlDeaFormData) => {
    onSubmit(values);
  };

  return (
    <Form layout="inline" form={form} onFinish={onFinish} colon>
      <Form.Item
        label="Target feed-in [%]"
        name={"active_power_percent"}
        required
      >
        <InputNumber min={0} max={100} required placeholder="0-100" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ControlDeaForm;
