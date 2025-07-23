import { MantineProvider, TooltipGroup } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const ClientPageRootComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider>
      <TooltipGroup openDelay={500}>
        <Notifications />
        {children}
      </TooltipGroup>
    </MantineProvider>
  );
};

export default ClientPageRootComponent;
