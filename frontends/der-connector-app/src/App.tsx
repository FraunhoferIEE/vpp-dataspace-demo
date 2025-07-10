import { Layout } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import PageFooter from "./components/PageFooter";
import DataspacePage from "./pages/DataspacePage";
import EnergySystemPage from "./pages/EnergySystemPage";
const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ marginBottom: "24px" }}>
        <MenuBar mode="horizontal" theme="dark" />
      </Header>

      <Content style={{ padding: "0 48px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dataspace" replace />} />
          <Route path="/dataspace" element={<DataspacePage />} />
          <Route path="/energy-system" element={<EnergySystemPage />} />
        </Routes>
      </Content>

      <PageFooter />
    </Layout>
  );
};

export default App;
