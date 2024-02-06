import React, { useState, useRef, useEffect } from "react";
import { Box, Select } from "@chakra-ui/react";

const FontDropdown = ({ selectedFont, onSelectFont, fontStyles }) => {
  return (
    <Box>
      <Select
        value={selectedFont}
        onChange={(e) => onSelectFont(e.target.value)}
        style={{ width: "120px" }}
      >
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
