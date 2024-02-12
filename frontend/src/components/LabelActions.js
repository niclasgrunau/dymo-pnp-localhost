import React from "react";
import { Flex, Input, Tooltip, Button } from "@chakra-ui/react";

// Component for label actions
const LabelActions = ({
  name,
  setName,
  tooltipLabel,
  tooltipOpen,
  setTooltipOpen,
  handleSaveLabel,
  loggedInUser,
  handleMouseOver,
  handleMouseLeave,
}) => {
  return (
    <Flex>
      {/* Input field for label name */}
      <Input
        type="text"
        value={name}
        placeholder="Enter label name..."
        onChange={(e) => setName(e.target.value)}
        width="180px"
        onFocus={() => setTooltipOpen(false)}
      />
      {/* Tooltip for saving label */}
      <Tooltip label={tooltipLabel} isOpen={tooltipOpen} placement="bottom">
        {/* Button to save label */}
        <Button
          colorScheme="blue"
          onClick={handleSaveLabel}
          ml="4"
          isDisabled={!loggedInUser || !name.trim()}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          Save label remote
        </Button>
      </Tooltip>
    </Flex>
  );
};

export default LabelActions;
