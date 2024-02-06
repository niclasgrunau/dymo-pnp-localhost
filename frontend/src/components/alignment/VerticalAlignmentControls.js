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
  RxTextAlignTop,
  RxTextAlignMiddle,
  RxTextAlignBottom,
} from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

const VerticalAlignmentControls = ({
  verticalAlignTop,
  verticalAlignMiddle,
  verticalAlignBottom,
  onToggleVerticalAlignment,
}) => {
  return (
    <Menu marginLeft="4">
      <MenuButton
        as={IconButton}
        aria-label="Vertical Alignment"
        icon={
          <>
            <Icon
              as={
                verticalAlignTop
                  ? RxTextAlignTop
                  : verticalAlignBottom
                  ? RxTextAlignBottom
                  : RxTextAlignMiddle
              }
              mr="1.5"
            />
            <IoIosArrowDown size={"16"} />
          </>
        }
        width="50px"
      />
      <MenuList>
        <MenuItem
          onClick={() => onToggleVerticalAlignment("top")}
          isChecked={verticalAlignTop}
          bgColor={verticalAlignTop ? "gray.200" : "transparent"}
          _hover={{
            bgColor: verticalAlignTop ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={RxTextAlignTop} marginRight="2" />
          Top
        </MenuItem>
        <MenuItem
          onClick={() => onToggleVerticalAlignment("middle")}
          isChecked={verticalAlignMiddle}
          bgColor={verticalAlignMiddle ? "gray.200" : "transparent"}
          _hover={{
            bgColor: verticalAlignMiddle ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={RxTextAlignMiddle} marginRight="2" />
          Middle
        </MenuItem>
        <MenuItem
          onClick={() => onToggleVerticalAlignment("bottom")}
          isChecked={verticalAlignBottom}
          bgColor={verticalAlignBottom ? "gray.200" : "transparent"}
          _hover={{
            bgColor: verticalAlignBottom ? "gray.200" : "gray.100",
          }}
        >
          <Icon as={RxTextAlignBottom} marginRight="2" />
          Bottom
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default VerticalAlignmentControls;
