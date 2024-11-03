import { MantineProvider } from "@mantine/core";

const ClientPageRootComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <MantineProvider>{children}</MantineProvider>;
};

export default ClientPageRootComponent;
