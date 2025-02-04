import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const ClientPageRootComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider>
      <Notifications />
      {children}
    </MantineProvider>
  );
};

export default ClientPageRootComponent;
