// FontSettings.js

import React from "react";
import { Box } from "@chakra-ui/react";
import FontDropdown from "./FontDropdown";
import FontSizeControls from "./FontSizeControls";

const FontSettings = ({
  selectedFont,
  onSelectFont,
  fontSize,
  onDecrease,
  onIncrease,
  onChange,
}) => {
  const fontStyles = [
    "Arial",
    "Arial Narrow",
    "Calibri",
    "Comic Sans MS",
    "Helvetica",
    "Roboto",
    "Times New Roman",
    "Verdana",
  ];

  return (
    <Box display="flex" alignItems="center">
      <FontDropdown
        selectedFont={selectedFont}
        onSelectFont={onSelectFont}
        fontStyles={fontStyles}
      />
      <Box marginLeft="5">
        <FontSizeControls
          fontSize={fontSize}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          onChange={onChange}
        />
      </Box>
    </Box>
  );
};

export default FontSettings;
