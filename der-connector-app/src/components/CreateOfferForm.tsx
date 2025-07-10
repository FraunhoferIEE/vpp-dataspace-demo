import { Button, DatePicker, Form, Select, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEdcConnector } from "../hooks/useEdcConnector";
const { RangePicker } = DatePicker;

interface AllowControlFormProps {}

type FieldType = {
  participantId?: string;
  laufzeit?: [Dayjs, Dayjs];
  sichtbarkeit?: [Dayjs, Dayjs];
};

const CreateOfferForm: React.FC<AllowControlFormProps> = () => {
  const { createOfferRemoteControlTimeRestricted, clearEverything } =
    useEdcConnector();

  const onFinish = async (values: FieldType) => {
    const { participantId, laufzeit } = values;
    const [start, end] = laufzeit || [];

    try {
      // Check if all required fields are filled
      if (!participantId || !start || !end) {
        throw new Error("Incorrect entry!");
      }

      await clearEverything();
      message.info("Preview access permissions terminated!");

      // create offer
      createOfferRemoteControlTimeRestricted(
        participantId,
        start.toISOString(),
        end.toISOString()
      );
      message.success("Plant control shared!");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const initStart = dayjs().startOf("year");
  const initEnd = dayjs().endOf("year");

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      colon
      initialValues={{
        participantId: "VKEE-0000-0000-0003",
        laufzeit: [initStart, initEnd],
      }}
    >
      <Form.Item<FieldType>
        label="Participant-ID"
        name="participantId"
        extra="Only the participant with this ID can access the meta information and later the plant control."
        rules={[{ required: true, message: "Pflichtangabe!" }]}
      >
        <Select>
          <Select.Option value="VKEE-0000-0000-0002">
            VKEE-0000-0000-0002 - [ ET Company #1 ]
          </Select.Option>
          <Select.Option value="VKEE-0000-0000-0003">
            VKEE-0000-0000-0003 - [ ET Company #2 ]
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item<FieldType>
        label="Duration of access"
        name="laufzeit"
        extra="Within this limited period, the participant can access the plant control system. After expiry, access is deactivated again."
        rules={[{ required: true, message: "Requiered!" }]}
      >
        <RangePicker format={"DD.MM.YYYY - HH:mm"} showTime />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Grant access
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOfferForm;
