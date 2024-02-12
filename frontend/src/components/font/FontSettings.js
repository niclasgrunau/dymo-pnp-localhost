import React from "react";
import { Box } from "@chakra-ui/react";
import FontDropdown from "./FontDropdown";
import FontSizeControls from "./FontSizeControls";

// Component for font settings
const FontSettings = ({
  selectedFont,
  onSelectFont,
  fontSize,
  onDecrease,
  onIncrease,
  onChange,
}) => {
  // List of available font styles
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
      {/* Font dropdown component */}
      <FontDropdown
        selectedFont={selectedFont}
        onSelectFont={onSelectFont}
        fontStyles={fontStyles}
      />
      <Box marginLeft="5">
        {/* Font size controls component */}
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
