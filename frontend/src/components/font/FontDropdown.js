import React from "react";
import { Box, Select } from "@chakra-ui/react";

// Component for font dropdown
const FontDropdown = ({ selectedFont, onSelectFont, fontStyles }) => {
  return (
    <Box>
      {/* Dropdown select for fonts */}
      <Select
        value={selectedFont}
        onChange={(e) => onSelectFont(e.target.value)}
        style={{ width: "120px" }}
      >
        {/* Map through font styles and render options */}
        {fontStyles.map((fontStyle) => (
          <option key={fontStyle} value={fontStyle}>
            {fontStyle}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default FontDropdown;
