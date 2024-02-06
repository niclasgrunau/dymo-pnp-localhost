import React from "react";
import { Box, IconButton, Input, Icon } from "@chakra-ui/react";
import { MdOutlineTextDecrease, MdOutlineTextIncrease } from "react-icons/md";

const FontSizeControls = ({ fontSize, onChange }) => {
  const handleDecrease = () => {
    const newFontSize = Math.max(parseInt(fontSize) - 1, 1);
    onChange(newFontSize.toString());
  };

  const handleIncrease = () => {
    const newFontSize = Math.min(parseInt(fontSize) + 1, 80);
    onChange(newFontSize.toString());
  };

  const handleChange = (e) => {
    const inputText = e.target.value.trim();

    if (
      inputText === "" ||
      (!isNaN(inputText) && inputText >= 1 && inputText <= 80)
    ) {
      onChange(inputText);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        icon={<Icon as={MdOutlineTextDecrease} />}
        aria-label="Decrease Font Size"
        onClick={handleDecrease}
      />
      <Input
        type="text"
        value={fontSize}
        onChange={handleChange}
        placeholder="Size"
        marginLeft="2"
        style={{ marginLeft: "2", width: "63px" }}
      />
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
