import * as Mantine from "@mantine/core";

const MantineModal: React.FC<Omit<Mantine.ModalProps, "z-index">> = (props) => {
  return (
    <Mantine.Modal zIndex={10000} {...props}>
      {props.children}
    </Mantine.Modal>
  );
};

export default MantineModal;
