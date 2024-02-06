import React from "react";
import { Box, Icon } from "@chakra-ui/react";
import { MdOutlineQrCode2 } from "react-icons/md";

const QrCodeToggle = ({ isChecked, onClick }) => {
  const baseIconStyles = {
    cursor: "pointer",
    borderRadius: "md",
    padding: "5px",
    boxSize: "50px",
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgColor={isChecked ? "gray.200" : "transparent"}
      _hover={{
        bgColor: isChecked ? "gray.200" : "gray.100",
      }}
      {...baseIconStyles}
      onClick={onClick}
    >
      <Icon as={MdOutlineQrCode2} color="gray.600" boxSize={10} />
    </Box>
  );
};

export default QrCodeToggle;
