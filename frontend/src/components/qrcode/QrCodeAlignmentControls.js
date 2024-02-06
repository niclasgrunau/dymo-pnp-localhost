import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { FaAlignLeft, FaAlignRight } from "react-icons/fa";

const QrCodeAlignmentControls = ({
  qrCodeAlignment,
  toggleQrCodeAlignment,
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          onClick={toggleQrCodeAlignment}
          border="1px solid #ccc"
          padding="2"
          color={qrCodeAlignment === "left" ? "black" : "black"}
          bgColor={qrCodeAlignment === "left" ? "gray.200" : "transparent"}
          _hover={{
            bgColor: qrCodeAlignment === "left" ? "gray.200" : "gray.100",
          }}
          cursor="pointer"
          fontWeight="normal"
        >
          <FaAlignLeft style={{ marginRight: "10px" }} />
          Left
        </Button>
        <Button
          onClick={toggleQrCodeAlignment}
          border="1px solid #ccc"
          padding="2"
          marginLeft="2"
          color={qrCodeAlignment === "right" ? "black" : "black"}
          bgColor={qrCodeAlignment === "right" ? "gray.200" : "transparent"}
          _hover={{
            bgColor: qrCodeAlignment === "right" ? "gray.200" : "gray.100",
          }}
          cursor="pointer"
          fontWeight="normal"
        >
          <FaAlignRight style={{ marginRight: "10px" }} />
          Right
        </Button>
      </Box>
    </Box>
  );
};

export default QrCodeAlignmentControls;
