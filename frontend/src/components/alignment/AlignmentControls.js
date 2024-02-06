import React from "react";
import { Box } from "@chakra-ui/react";
import TextAlignmentControls from "./TextAlignmentControls";
import VerticalAlignmentControls from "./VerticalAlignmentControls";

const AlignmentControls = ({
  textAlignLeft,
  textAlignCenter,
  textAlignRight,
  toggleAlignment,
  verticalAlignTop,
  verticalAlignMiddle,
  verticalAlignBottom,
  toggleVerticalAlignment,
}) => {
  return (
    <Box display="flex" alignItems="center">
      <TextAlignmentControls
        textAlignLeft={textAlignLeft}
        textAlignCenter={textAlignCenter}
        textAlignRight={textAlignRight}
        onToggleAlignment={toggleAlignment}
      />
      <Box marginLeft="5">
        <VerticalAlignmentControls
          verticalAlignTop={verticalAlignTop}
          verticalAlignMiddle={verticalAlignMiddle}
          verticalAlignBottom={verticalAlignBottom}
          onToggleVerticalAlignment={toggleVerticalAlignment}
        />{" "}
      </Box>
    </Box>
  );
};

export default AlignmentControls;
