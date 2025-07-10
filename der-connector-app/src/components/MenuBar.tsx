import {
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuBarProps {
  theme?: MenuProps["theme"];
  mode?: MenuProps["mode"];
}

const items: MenuProps["items"] = [
  {
    label: "Dataspace",
    key: "dataspace",
    icon: <FireOutlined />,
  },

  {
    label: "Energy System",
    key: "energy-system",
    icon: <ThunderboltOutlined />,
  },
];

const MenuBar: React.FC<MenuBarProps> = ({ mode, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const updateSelectedKeys = () => {
      if (location.pathname.startsWith("/dataspace")) {
        return ["dataspace"];
      }
      if (location.pathname.startsWith("/energy-system")) {
        return ["energy-system"];
      }
      return [];
    };

    setSelectedKeys(updateSelectedKeys());
  }, [location.pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Menu
      theme={theme}
      mode={mode}
      selectedKeys={selectedKeys}
      items={items}
      onClick={onClick}
    />
  );
};

export default MenuBar;
