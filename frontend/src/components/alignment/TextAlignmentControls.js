import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

// Component for text alignment controls
const TextAlignmentControls = ({
  textAlignLeft,
  textAlignCenter,
  textAlignRight,
  onToggleAlignment,
}) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Text Alignment"
        icon={
          <>
            <Icon
              as={
                textAlignLeft
                  ? MdFormatAlignLeft
                  : textAlignRight
                  ? MdFormatAlignRight
                  : MdFormatAlignCenter
              }
              mr="1.5"
            />
            <IoIosArrowDown size={"16"} />
          </>
        }
        width="50px"
      />
      <MenuList>
        {/* MenuItem for left alignment */}
        <MenuItem
          onClick={() => onToggleAlignment("left")}
          isChecked={textAlignLeft}
          bgColor={textAlignLeft ? "gray.200" : "transparent"}
          _hover={{
            bgColor: textAlignLeft ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={MdFormatAlignLeft} marginRight="2" />
          Left
        </MenuItem>
        {/* MenuItem for center alignment */}
        <MenuItem
          onClick={() => onToggleAlignment("center")}
          isChecked={textAlignCenter}
          bgColor={textAlignCenter ? "gray.200" : "transparent"}
          _hover={{
            bgColor: textAlignCenter ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={MdFormatAlignCenter} marginRight="2" />
          Center
        </MenuItem>
        {/* MenuItem for right alignment */}
        <MenuItem
          onClick={() => onToggleAlignment("right")}
          isChecked={textAlignRight}
          bgColor={textAlignRight ? "gray.200" : "transparent"}
          _hover={{
            bgColor: textAlignRight ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={MdFormatAlignRight} marginRight="2" />
          Right
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default TextAlignmentControls;
