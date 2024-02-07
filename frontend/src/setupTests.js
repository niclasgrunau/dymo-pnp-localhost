//Qrcode geht
//app.js
import React, { useState, useRef, useEffect } from "react";
import { ChakraProvider, Box, Button, Heading, Link } from "@chakra-ui/react";
import "./App.css";
import QRCode from "qrcode.react";
import { Checkbox } from "@chakra-ui/react";
import qrcode from "qrcode";

const API_ENDPOINT = "https://lehre.bpm.in.tum.de/ports/6982//generate-image";

function App() {
  const maxLines = 2;
  const handleTextareaChange = (event) => {
    const inputValue = event.target.value;
    const lines = inputValue.split("\n");
    if (lines.length <= maxLines) {
      setInputText(inputValue);
    }
  };

  const [inputText, setInputText] = useState("");
  const [fontSize, setFontSize] = useState("12");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlignLeft, setTextAlignLeft] = useState(false);
  const [textAlignCenter, setTextAlignCenter] = useState(true); // Default to center
  const [textAlignRight, setTextAlignRight] = useState(false);
  const [lineSpacing, setLineSpacing] = useState("5"); // Set the initial line spacing value
  const [customLineSpacing, setCustomLineSpacing] = useState(""); // State to store the custom line spacing value
  const [verticalAlignTop, setVerticalAlignTop] = useState(false);
  const [verticalAlignMiddle, setVerticalAlignMiddle] = useState(true); // Default to middle
  const [verticalAlignBottom, setVerticalAlignBottom] = useState(false);
  const [canvasSize, setCanvasSize] = useState("medium"); // Default to medium size
  const [canvasSizeChanged, setCanvasSizeChanged] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [urlInput]);

  useEffect(() => {
    if (qrCodeVisible) {
      generateQRCode();
    } else {
      // If qrCodeVisible is false, clear the URL input and regenerate the image
      setUrlInput("");
      generateImage();
    }
  }, [qrCodeVisible]);

  useEffect(() => {
    if (qrCodeVisible) {
      generateQRCode();
    }
  }, [qrCodeVisible]);

  useEffect(() => {
    if (canvasSizeChanged) {
      generateImage();
      setCanvasSizeChanged(false);
    } else {
      generateImage();
    }
  }, [
    inputText,
    fontSize,
    isBold,
    isItalic,
    isUnderline,
    textAlignLeft,
    textAlignCenter,
    textAlignRight,
    lineSpacing,
    customLineSpacing,
    verticalAlignTop,
    verticalAlignMiddle,
    verticalAlignBottom,
    canvasSize, // Include canvasSize in the dependency array
    qrCodeData, // Include qrCodeData in the dependency array
  ]);

  const handleCustomLineSpacingChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length < 4) {
      setCustomLineSpacing(value);
      setLineSpacing(value); // Set lineSpacing as well
    }
  };

  const handleLineSpacingChange = (event) => {
    const value = event.target.value;
    setLineSpacing(value);
    setCustomLineSpacing(""); // Reset customLineSpacing when predefined value is selected
  };

  const toggleAlignment = (alignment) => {
    setTextAlignLeft(alignment === "left");
    setTextAlignCenter(alignment === "center");
    setTextAlignRight(alignment === "right");
    handleAlignmentChange();
  };

  const toggleVerticalAlignment = (alignment) => {
    setVerticalAlignTop(alignment === "top");
    setVerticalAlignMiddle(alignment === "middle");
    setVerticalAlignBottom(alignment === "bottom");
    handleAlignmentChange();
  };

  const generateImage = async () => {
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      //
      const qrCodeSize = 100;
      const qrCodeX = (canvas.width - qrCodeSize) / 2;
      const qrCodeY = (canvas.height - qrCodeSize) / 2;

      if (qrCodeVisible && qrCodeData) {
        const qrImageDataUrl = await qrcode.toDataURL(qrCodeData, {
          width: qrCodeSize,
        });
        const qrImage = new Image();
        qrImage.src = qrImageDataUrl;

        qrImage.onload = () => {
          context.drawImage(qrImage, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
        };
      }

      //

      let dynamicFontSize = parseFloat(fontSize);
      context.font = `${isBold ? "bold " : ""}${
        isItalic ? "italic " : ""
      }${dynamicFontSize}px sans-serif`;
      context.fillStyle = "black";
      context.textBaseline = "middle";
      const userText = inputText || "";
      const lines = userText.split("\n");

      let startY;
      if (verticalAlignTop) {
        startY = dynamicFontSize;
      } else if (verticalAlignMiddle) {
        startY =
          canvas.height / 2 -
          ((lines.length - 1) * dynamicFontSize +
            (lines.length - 1) * parseInt(lineSpacing)) /
            2;
      } else {
        startY =
          canvas.height -
          lines.length * dynamicFontSize -
          (lines.length - 1) * parseInt(lineSpacing);
      }

      lines.forEach((line, index) => {
        let textWidth = context.measureText(line).width;
        let startX;
        if (textAlignLeft) {
          startX = 50;
        } else if (textAlignRight) {
          startX = canvas.width - textWidth - 50;
        } else {
          startX = (canvas.width - textWidth) / 2;
        }

        while (textWidth > canvas.width - 2 * 50) {
          dynamicFontSize -= 2;
          context.font = `${isBold ? "bold " : ""}${
            isItalic ? "italic " : ""
          }${dynamicFontSize}px sans-serif`;
          textWidth = context.measureText(line).width;
        }

        if (textAlignLeft) {
          startX = 50;
        } else if (textAlignRight) {
          startX = canvas.width - textWidth - 50;
        } else {
          startX = (canvas.width - textWidth) / 2;
        }

        context.fillText(
          line,
          startX,
          startY + index * (dynamicFontSize + parseInt(lineSpacing))
        );

        if (isUnderline) {
          const endX = startX + textWidth;
          const y =
            startY +
            index * (dynamicFontSize + parseInt(lineSpacing)) +
            dynamicFontSize / 2;
          context.beginPath();
          context.moveTo(startX, y);
          context.lineTo(endX, y);
          context.stroke();
        }
      });
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const downloadImage = () => {
    try {
      const canvas = canvasRef.current; // Access the canvas element through the ref
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "customizedText.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" padding="6" backgroundColor="#f2f2f2">
        <Heading as="h1" size="xl">
          Print
        </Heading>

        <Box
          position="relative"
          width="100%"
          maxWidth="sm" // Set the width according to your layout
          margin="auto"
        >
          <textarea
            value={inputText}
            onChange={handleTextareaChange}
            placeholder="Type something..."
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #cbd5e0",
              borderRadius: "md",
              resize: "none",
              boxSizing: "border-box",
              height: "4em", // Approximate height for 2 lines
              overflowY: "hidden", // Hide additional lines
            }}
          />
        </Box>

        <label>
          Font Size
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="15">15</option>
            <option value="18">18</option>
            <option value="20">20</option>
          </select>
        </label>

        <label>
          Bold
          <input
            type="checkbox"
            checked={isBold}
            onChange={() => setIsBold(!isBold)}
          />
        </label>

        <label>
          Italic
          <input
            type="checkbox"
            checked={isItalic}
            onChange={() => setIsItalic(!isItalic)}
          />
        </label>

        <label>
          Underline
          <input
            type="checkbox"
            checked={isUnderline}
            onChange={() => setIsUnderline(!isUnderline)}
          />
        </label>

        <label>
          Line Spacing
          <select
            value={customLineSpacing !== "" ? customLineSpacing : lineSpacing}
            onChange={handleLineSpacingChange}
            style={{ marginLeft: "5px" }}
          >
            {lineSpacingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span style={{ marginLeft: "5px" }}>or</span>
          <input
            type="text"
            value={customLineSpacing}
            onChange={handleCustomLineSpacingChange}
            style={{
              width: "30px",
              marginLeft: "5px",
              padding: "5px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          />
        </label>

        <Box marginTop="4">
          <Heading as="h2" size="md">
            QR Code
          </Heading>
          <Checkbox
            isChecked={qrCodeVisible}
            onChange={toggleQrCodeVisibility}
            marginTop="2"
          >
            Use QRCode
          </Checkbox>
          {qrCodeVisible && (
            <>
              <label style={{ textAlign: "center" }}>
                URL
                <input
                  type="text"
                  value={urlInput}
                  onChange={handleUrlInputChange}
                  style={{ marginLeft: "5px" }}
                />
              </label>
            </>
          )}
        </Box>

        <Heading as="h2" size="md" marginTop="4">
          Text Alignment
        </Heading>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="2"
          marginBottom="4"
        >
          <Box
            onClick={() => toggleAlignment("left")}
            border="1px solid #ccc"
            padding="2"
            marginRight="2"
            backgroundColor={textAlignLeft ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Left
          </Box>
          <Box
            onClick={() => toggleAlignment("center")}
            border="1px solid #ccc"
            padding="2"
            marginRight="2"
            backgroundColor={textAlignCenter ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Center
          </Box>
          <Box
            onClick={() => toggleAlignment("right")}
            border="1px solid #ccc"
            padding="2"
            backgroundColor={textAlignRight ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Right
          </Box>
        </Box>

        <Heading as="h2" size="md" marginTop="4">
          Vertical Alignment
        </Heading>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="2"
          marginBottom="4"
        >
          <Box
            onClick={() => toggleVerticalAlignment("top")}
            border="1px solid #ccc"
            padding="2"
            marginRight="2"
            backgroundColor={verticalAlignTop ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Top
          </Box>
          <Box
            onClick={() => toggleVerticalAlignment("middle")}
            border="1px solid #ccc"
            padding="2"
            marginRight="2"
            backgroundColor={verticalAlignMiddle ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Middle
          </Box>
          <Box
            onClick={() => toggleVerticalAlignment("bottom")}
            border="1px solid #ccc"
            padding="2"
            backgroundColor={verticalAlignBottom ? "#ddd" : "transparent"}
            cursor="pointer"
          >
            Bottom
          </Box>
        </Box>

        <label>
          Canvas Size
          <select
            value={canvasSize}
            onChange={handleCanvasSizeChange}
            style={{ marginLeft: "5px" }}
          >
            {canvasSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button colorScheme="teal" onClick={downloadImage} marginBottom="4">
          Download Image
        </Button>

        {/* Preview section */}
        <Heading as="h2" size="md" marginBottom="2">
          Preview
        </Heading>
        {/* Use the ref to access the canvas element */}
        <canvas
          ref={canvasRef}
          width={
            canvasSize === "small" ? 224 : canvasSize === "big" ? 880 : 452
          }
          height="70"
          style={{
            border: "1px solid #ccc",
          }}
        />
      </Box>
    </ChakraProvider>
  );
}
export default App;
