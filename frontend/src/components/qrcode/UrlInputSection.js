import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Flex,
  FormControl,
  Spinner,
} from "@chakra-ui/react";

// Component for URL input section
const UrlInputSection = ({
  qrCodeVisible,
  urlInput,
  loading,
  handleUrlInputChange,
  handleShortenUrl,
  generateQRCode,
}) => {
  // Handle URL change
  const handleUrlChange = (event) => {
    // Call parent function to handle URL input change
    handleUrlInputChange(event);
    // Generate QR code
    generateQRCode();
  };

  return (
    <Box>
      {qrCodeVisible && (
        <FormControl>
          <Flex>
            {/* Input field for URL */}
            <Input
              type="text"
              value={urlInput}
              placeholder="Enter URL..."
              onChange={handleUrlChange}
              color="black"
              width="190px"
            />
            {/* Button to set URL */}
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
