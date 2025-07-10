import { Layout, Typography, theme } from "antd";

const { Header } = Layout;

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const {
    token: { colorWhite },
  } = theme.useToken();

  return (
    <Header>
      <Typography.Text style={{ color: colorWhite, fontSize: 20 }}>
        {title}
      </Typography.Text>
    </Header>
  );
};

export default PageHeader;
