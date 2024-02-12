import React from "react";
import { Box, Icon } from "@chakra-ui/react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

// Component for text formatting controls (bold, italic, underline)
const TextFormattingControls = ({
  isBold,
  isItalic,
  isUnderline,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
}) => {
  // Base styles for the icons
  const baseIconStyles = {
    cursor: "pointer",
    borderRadius: "md",
    padding: "5px",
    boxSize: "32px",
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Bold icon */}
      <Icon
        as={FaBold}
        color={isBold ? "gray.600" : "gray.600"}
        bgColor={isBold ? "gray.200" : "transparent"}
        _hover={{
          bgColor: isBold ? "gray.200" : "gray.100",
        }}
        {...baseIconStyles}
        onClick={onToggleBold}
      />
      {/* Italic icon */}
      <Icon
        as={FaItalic}
        color={isItalic ? "gray.600" : "gray.600"}
        bgColor={isItalic ? "gray.200" : "transparent"}
        _hover={{
          bgColor: isItalic ? "gray.200" : "gray.100",
        }}
        {...baseIconStyles}
        onClick={onToggleItalic}
        marginLeft="15px"
      />
      {/* Underline icon */}

      <Icon
        as={FaUnderline}
        color={isUnderline ? "gray.600" : "gray.600"}
        bgColor={isUnderline ? "gray.200" : "transparent"}
        _hover={{
          bgColor: isUnderline ? "gray.200" : "gray.100",
        }}
        {...baseIconStyles}
        onClick={onToggleUnderline}
        marginLeft="15px"
      />
    </Box>
  );
};

export default TextFormattingControls;
