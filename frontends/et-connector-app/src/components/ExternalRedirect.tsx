import { Spin } from "antd";
import React, { useEffect } from "react";

interface ExternalRedirectProps {
  to: string;
}

const ExternalRedirect: React.FC<ExternalRedirectProps> = ({ to }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <Spin spinning={true} fullscreen />;
};

export default ExternalRedirect;
