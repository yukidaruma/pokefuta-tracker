import * as Mantine from "@mantine/core";
import { notifications } from "@mantine/notifications";

type CopyableProps = {
  value: string;
  copyMessage: string;
  children: React.ReactNode;
};

const Copyable: React.FC<CopyableProps> = ({
  value,
  copyMessage,
  children,
}) => {
  return (
    <Mantine.CopyButton value={value}>
      {({ copy }) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
            copy();
            notifications.show({ message: copyMessage });
          }}
        >
          {children}
        </span>
      )}
    </Mantine.CopyButton>
  );
};

export default Copyable;
