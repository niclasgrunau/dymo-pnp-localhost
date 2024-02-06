import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Flex,
  FormControl,
  Spinner,
} from "@chakra-ui/react";

const UrlInputSection = ({
  qrCodeVisible,
  urlInput,
  loading,
  handleUrlInputChange,
  handleShortenUrl,
  generateQRCode,
}) => {
  const handleUrlChange = (event) => {
    handleUrlInputChange(event);
    generateQRCode();
  };

  return (
    <Box>
      {qrCodeVisible && (
        <FormControl>
          <Flex>
            <Input
              type="text"
              value={urlInput}
              placeholder="Enter URL..."
              onChange={handleUrlChange}
              color="black"
              width="190px"
            />
            <Button
              colorScheme="blue"
              onClick={handleShortenUrl}
              ml="4"
              isLoading={loading}
            >
              Set URL
            </Button>
          </Flex>
        </FormControl>
      )}
    </Box>
  );
};

export default UrlInputSection;
