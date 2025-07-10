import { Layout, Typography } from "antd";

const { Footer } = Layout;

interface PageFooterProps {}

const PageFooter: React.FC<PageFooterProps> = () => {
  return (
    <Footer>
      <Typography style={{ textAlign: "center" }}>
        Demonstrator © 2025 Fraunhofer IEE
      </Typography>
    </Footer>
  );
};

export default PageFooter;
