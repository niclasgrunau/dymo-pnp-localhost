import React from "react";
import { Box, IconButton, Input, Icon } from "@chakra-ui/react";
import { MdOutlineTextDecrease, MdOutlineTextIncrease } from "react-icons/md";

// Component for font size controls
const FontSizeControls = ({ fontSize, onChange }) => {
  // Handle decrease font size
  const handleDecrease = () => {
    const newFontSize = Math.max(parseInt(fontSize) - 1, 20);
    onChange(newFontSize.toString());
  };

  // Handle increase font size
  const handleIncrease = () => {
    const newFontSize = Math.min(parseInt(fontSize) + 1, 80);
    onChange(newFontSize.toString());
  };

  // Handle input change
  const handleChange = (e) => {
    const inputText = e.target.value.trim();

    // Check if input is empty or within valid range
    if (
      inputText === "" ||
      (!isNaN(inputText) && inputText >= 20 && inputText <= 80)
    ) {
      onChange(inputText);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Button to decrease font size */}
      <IconButton
        icon={<Icon as={MdOutlineTextDecrease} />}
        aria-label="Decrease Font Size"
        onClick={handleDecrease}
      />
      {/* Input for font size */}
      <Input
        type="text"
        value={fontSize}
        onChange={handleChange}
        placeholder="Size"
        marginLeft="2"
        style={{ marginLeft: "2", width: "63px" }}
      />
      {/* Button to increase font size */}
      <IconButton
        icon={<Icon as={MdOutlineTextIncrease} />}
        aria-label="Increase Font Size"
        onClick={handleIncrease}
        marginLeft="2"
      />
    </Box>
  );
};

export default FontSizeControls;
