import * as Mantine from "@mantine/core";
import { notifications } from "@mantine/notifications";

type CopyableProps = {
  value: string;
  copyMessage: string;
} & (
  | { button: React.ReactNode; children?: undefined }
  | { button?: undefined; children: React.ReactNode }
);

const Copyable: React.FC<CopyableProps> = ({
  value,
  copyMessage,
  button,
  children,
}) => {
  return (
    <Mantine.CopyButton value={value}>
      {({ copy }) => {
        const onClick = () => {
          copy();
          notifications.show({ message: copyMessage });
        };

        return button ? (
          <div onClick={onClick}>{button}</div>
        ) : (
          <span className="cursor-pointer hover:underline" onClick={onClick}>
            {children}
          </span>
        );
      }}
    </Mantine.CopyButton>
  );
};

export default Copyable;
