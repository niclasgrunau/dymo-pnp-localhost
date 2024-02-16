import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider,
  extendTheme,
  Box,
  Button,
  Heading,
  Textarea,
  Spacer,
  Input,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Link,
  Modal,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./App.css";

import qrcode from "qrcode";
import axios from "axios";

import LabelActions from "./components/LabelActions";
import LabelList from "./components/LabelList";
import TextFormattingControls from "./components/TextFormattingControls";
import FontSettings from "./components/font/FontSettings";
import AlignmentControls from "./components/alignment/AlignmentControls";
import QrCodeToggle from "./components/qrcode/QrCodeToggle";
import UrlInputSection from "./components/qrcode/UrlInputSection";
import QrCodeAlignmentControls from "./components/qrcode/QrCodeAlignmentControls";

function App() {
  // Define state variables and their setter functions using useState hook
  const [inputText, setInputText] = useState("");
  const [fontSize, setFontSize] = useState("30");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlignLeft, setTextAlignLeft] = useState(false);
  const [textAlignCenter, setTextAlignCenter] = useState(true);
  const [textAlignRight, setTextAlignRight] = useState(false);
  const [lineSpacing, setLineSpacing] = useState("8");
  const [customLineSpacing, setCustomLineSpacing] = useState("");
  const [verticalAlignTop, setVerticalAlignTop] = useState(false);
  const [verticalAlignMiddle, setVerticalAlignMiddle] = useState(true);
  const [verticalAlignBottom, setVerticalAlignBottom] = useState(false);
  const [canvasSize, setCanvasSize] = useState("medium");
  const [canvasSizeChanged, setCanvasSizeChanged] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userLabels, setUserLabels] = useState([]);
  const [labelsLoaded, setLabelsLoaded] = useState(false);
  const [fetchLabel, setFetchLabel] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [qrCodeAlignment, setQrCodeAlignment] = useState("left");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [loading, setLoading] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [loginStatus, setLoginStatus] = useState({
    success: true,
    message: "",
  });

  //API Key for URL shortener service. Long URLs lead to large QR codes that cannot be read on the small label paper
  const apiKey = "dklXZ5YlmsgocRzvqUJDewFiniUeV68sfCohvJkQKTzrqQUrwByzXJVzJYxC";

  // Define Chakra UI theme
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: "white",
          color: "black",
          fontFamily: "",
        },
      },
    },
    components: {
      Heading: {
        baseStyle: {
          fontWeight: "bold",
          fontSize: "3xl",
          textAlign: "center",
          mb: "4",
          color: "black",
        },
      },
    },
  });

  //Seperate UseEffect
  useEffect(() => {
    generateImage();
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
    canvasSize,
    qrCodeData,
    qrCodeVisible,
    urlInput,
    qrCodeAlignment,
    selectedFont,
  ]);

  //UseEffect
  useEffect(() => {
    // Fetch user labels if user is logged in and fetchLabel flag is set
    if (loggedInUser && fetchLabel) {
      fetchUserLabels();
      setFetchLabel(false);
    }

    // Reset name, email, and password fields if modal is open
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
    }

    // Function to get current date and time
    const getCurrentDateTime = () => {
      const now = new Date();
      return now.toISOString();
    };

    // Set createdAt state variable
    setCreatedAt(getCurrentDateTime());

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Set logged in user if user data exists in local storage
      setLoggedInUser(JSON.parse(storedUser));
    }

    // Generate QR code if it's visible
    if (qrCodeVisible) {
      generateQRCode();
    } else if (!qrCodeVisible) {
      // Clear URL input if QR code is not visible
      setUrlInput("");
    }
  }, [
    loggedInUser,
    isOpen,
    canvasSizeChanged,
    updateButtonClicked,
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
    canvasSize,
    qrCodeData,
    qrCodeVisible,
    urlInput,
    updateButtonClicked,
    shortenedUrl,
    qrCodeAlignment,
    selectedFont,
  ]);

  // Function to reset registration error
  const resetRegistrationError = () => {
    setRegistrationError(null);
  };

  // Function to reset login error
  const resetLoginError = () => {
    setLoginStatus(false, "");
  };

  // Function to open modal
  const onOpen = () => setIsOpen(true);

  // Function to close modal
  const onClose = () => {
    setIsOpen(false);
    resetRegistrationError();
    resetLoginError();
  };

  // Function to toggle display of labels
  const handleShowLabels = () => {
    setShowLabels(!showLabels);
  };

  // Function to toggle between login and registration mode
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setName("");
    setEmail("");
    setPassword("");
    resetRegistrationError();
    resetLoginError();
  };

  // Function to handle mouse hover event
  const handleMouseOver = () => {
    // If user is (not) logged in, set tooltip label and open tooltip
    if (!loggedInUser) {
      setTooltipLabel("Log in to save labels remote");
      setTooltipOpen(true);
    } else if (loggedInUser && !name.trim()) {
      setTooltipLabel("Type in label name");
      setTooltipOpen(true);
    }
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  // Function to toggle QR code alignment
  const toggleQrCodeAlignment = () => {
    setQrCodeAlignment((prevAlignment) =>
      prevAlignment === "left" ? "right" : "left"
    );
  };

  // Function to toggle QR code visibility
  const toggleQrCodeVisibility = () => {
    if (qrCodeVisible) {
      // Clear URL input and shortened URL
      setUrlInput("");
      setShortenedUrl("");
    }
    setQrCodeVisible(!qrCodeVisible);
  };

  // Function to handle textarea change
  const handleTextareaChange = (event) => {
    // Maximum number of lines allowed
    const maxLines = 2;

    // Get input value
    const inputValue = event.target.value;

    // Split input value by line breaks
    const lines = inputValue.split("\n");

    // If number of lines is within limit, set input text
    if (lines.length <= maxLines) {
      setInputText(inputValue);
    }
  };

  // Function to handle URL input change
  const handleUrlInputChange = (event) => {
    setUrlInput(event.target.value);
  };

  // Function to open print modal
  const openPrintModal = () => {
    setIsPrintModalOpen(true);
  };

  // Function to close print modal
  const closePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  // Function to generate QR code
  const generateQRCode = async () => {
    try {
      // Determine URL to display in QR code
      const shortenedUrlToDisplay = qrCodeVisible ? shortenedUrl : urlInput;

      // Set QR code data state with the URL
      setQRCodeData(shortenedUrlToDisplay || "");

      if (qrCodeVisible && shortenedUrlToDisplay) {
        // Generate QR code image data URL
        const qrImageDataUrl = await qrcode.toDataURL(shortenedUrlToDisplay, {
          width: 70, // Set width of QR code
        });

        // Create new image element
        const qrImage = new Image();

        // Set source of image to QR code data URL
        qrImage.src = qrImageDataUrl;

        // When QR code image is loaded
        qrImage.onload = () => {
          // Get canvas element
          const canvas = canvasRef.current;

          // Get canvas 2D rendering context
          const context = canvas.getContext("2d");

          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Generate the main image
          generateImage();

          // Calculate position of QR code
          const qrCodeX = qrCodeAlignment === "left" ? -10 : canvas.width - 80;
          const qrCodeY = (canvas.height - 90) / 2;

          // Draw QR code on canvas
          context.drawImage(qrImage, qrCodeX, qrCodeY, 90, 90);
        };
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // Reference to canvas element
  const canvasRef = useRef(null);

  // Function to toggle text alignment
  const toggleAlignment = (alignment) => {
    setTextAlignLeft(alignment === "left");
    setTextAlignCenter(alignment === "center");
    setTextAlignRight(alignment === "right");
  };

  // Function to toggle vertical text alignment
  const toggleVerticalAlignment = (alignment) => {
    setVerticalAlignTop(alignment === "top");
    setVerticalAlignMiddle(alignment === "middle");
    setVerticalAlignBottom(alignment === "bottom");
  };

  // Function to generate main image
  const generateImage = async () => {
    try {
      // Get canvas element / 2D rendering context
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set background color of canvas
      context.fillStyle = "white";

      // Fill canvas with white color (should do the same as the line above, but sometimes only worked with both)
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Size of QR code
      const qrCodeSize = 90;

      // Start position for text
      const textStartX = qrCodeVisible ? qrCodeSize : 0;

      // Initialize dynamic font size
      let dynamicFontSize = parseFloat(fontSize);

      // Set font size and family
      context.font = `${isBold ? "bold " : ""}${
        isItalic ? "italic " : ""
      }${dynamicFontSize}px ${selectedFont}`;

      // Set text color
      context.fillStyle = "black";

      // Set baseline for text
      context.textBaseline = "middle";

      // Get user input text
      const userText = inputText || "";

      // Split text into lines
      const lines = userText.split("\n");

      // Iterate through each line
      lines.forEach((line, index) => {
        let startY;
        if (verticalAlignTop) {
          // Set Y position to font size
          startY = dynamicFontSize;
        } else if (verticalAlignMiddle) {
          // Calculate Y position
          startY =
            canvas.height / 2 -
            ((lines.length - 1) * dynamicFontSize +
              (lines.length - 1) * parseInt(lineSpacing)) /
              2;
        } else {
          // If text is vertically aligned to bottom
          startY =
            canvas.height -
            lines.length * dynamicFontSize -
            (lines.length - 1) * parseInt(lineSpacing);
        }

        // Get width of text
        let textWidth = context.measureText(line).width;
        let startX;

        // Adjust font size if text width exceeds canvas width
        while (textWidth > canvas.width - 2 * textStartX) {
          // Decrease font size
          dynamicFontSize -= 2;

          // Update font size and family
          context.font = `${isBold ? "bold " : ""}${
            isItalic ? "italic " : ""
          }${dynamicFontSize}px ${selectedFont}`;

          // Recalculate text width
          textWidth = context.measureText(line).width;
        }

        // If text is aligned to left
        if (textAlignLeft) {
          // Set X position to text start
          startX = textStartX;
        } else if (textAlignRight) {
          startX = canvas.width - textWidth - textStartX;
        } else {
          // Calculate X position for center alignment
          startX = (canvas.width - textWidth) / 2;
        }

        // Draw text on canvas
        context.fillText(
          line,
          startX,
          startY + index * (dynamicFontSize + parseInt(lineSpacing))
        );

        // If text is underlined
        if (isUnderline) {
          // Calculate end position for underline
          const endX = startX + textWidth;
          const y =
            startY +
            index * (dynamicFontSize + parseInt(lineSpacing)) +
            dynamicFontSize / 2;
          // Begin path for drawing
          context.beginPath();

          // Move to starting point of underline
          context.moveTo(startX, y);

          // Draw line for underline
          context.lineTo(endX, y);

          // Stroke the line
          context.stroke();
        }
      });
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // Function to handle user registration
  const handleRegistration = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    resetRegistrationError();

    try {
      // Send POST request to register user, API endpoint for user registration
      const response = await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/users/register",
        {
          name,
          email,
          password,
        }
      );
      if (response.status === 201) {
        console.log("User registered successfully");
        // Close registration modal
        onClose();
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRegistrationError(error.response.data.error);
      } else {
        console.error("Error during registration:", error);
      }
    }
  };

  // Function to handle user login
  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    resetLoginError();

    try {
      // Send POST request to log in user, API endpoint for user login
      const response = await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/users/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Reload page
        await window.location.reload();

        // Set logged-in user state
        setLoggedInUser(response.data.user);

        // Close login modal
        onClose();
      } else {
        console.error("Login failed");
        setLoginStatus({ success: false, message: "Wrong Email / Password" });
      }

      // Fetch user labels
      await fetchUserLabels();
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus({ success: false, message: "Wrong Email / Password" });
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem("user");
    setLoggedInUser(null);

    // Clear user labels
    clearUserLabels();
  };

  // Function to clear user labels
  const clearUserLabels = () => {
    setUserLabels([]);
    setLabelsLoaded(false);
  };

  // Function to handle saving label data
  const handleSaveLabel = async () => {
    try {
      if (!loggedInUser) {
        console.error("User not logged in");
        return;
      }
      // Send POST request to save label data, API endpoint for saving label data
      const response = await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/labels/save",
        {
          userId: loggedInUser._id,
          name: name,
          text: inputText,
          fontStyle: selectedFont,
          fontSize: fontSize,
          isBold: isBold,
          isItalic: isItalic,
          isUnderline: isUnderline,
          textAlignment: textAlignLeft
            ? "left"
            : textAlignRight
            ? "right"
            : "center",
          verticalAlignment: verticalAlignTop
            ? "top"
            : verticalAlignBottom
            ? "bottom"
            : "middle",
          isQRCodeUsed: qrCodeVisible,
          url: urlInput,
          shortenedUrl: shortenedUrl,
          createdAt: createdAt,
        }
      );

      if (response.status === 201) {
        // Clear label name
        setName("");
        console.log("Label saved successfully");

        // Fetch user labels
        await fetchUserLabels();
      } else {
        console.error("Error saving label");
      }
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  // Function to fetch user labels
  const fetchUserLabels = async () => {
    try {
      if (loggedInUser) {
        // Send GET request to fetch user labels, API endpoint for fetching user labels
        const response = await axios.get(
          "https://lehre.bpm.in.tum.de/ports/6982/labels/user/${loggedInUser._id}"
        );
        // Set user labels state
        await setUserLabels(response.data);
        setLabelsLoaded(true);
      } else {
        // Clear user labels
        clearUserLabels();
      }
    } catch (error) {
      console.error("Error fetching user labels:", error);
    }
  };

  // Function to handle using a label
  const handleUseLabel = (label) => {
    setInputText(label.text || "");
    setSelectedFont(label.fontStyle || "Helvetica");
    setFontSize(label.fontSize || "12");
    setIsBold(label.isBold || false);
    setIsItalic(label.isItalic || false);
    setIsUnderline(label.isUnderline || false);
    setTextAlignLeft(label.textAlignment === "left");
    setTextAlignCenter(label.textAlignment === "center");
    setTextAlignRight(label.textAlignment === "right");
    setVerticalAlignTop(label.verticalAlignment === "top");
    setVerticalAlignMiddle(label.verticalAlignment === "middle");
    setVerticalAlignBottom(label.verticalAlignment === "bottom");
    setQrCodeVisible(label.isQRCodeUsed || false);
    setUrlInput(label.url || "");
    setCreatedAt(label.createdAt || null);
  };

  // Function to display URL
  const displayUrl = (url) => {
    // If URL starts with "http://"
    if (url.startsWith("http://")) {
      // Remove "http://" from URL
      return url.slice(7);
    } else if (url.startsWith("https://")) {
      // Remove "https://" from URL
      return url.slice(8);
    } else {
      // Return URL as is
      return url;
    }
  };

  // Function to handle delete label button click
  const handleDeleteLabelButtonClick = async (labelId) => {
    await handleDeleteLabel(labelId);
  };

  // Function to handle label deletion
  const handleDeleteLabel = async (labelId) => {
    try {
      // Send DELETE request to delete label, API endpoint for deleting label
      const response = await axios.delete(
        "https://lehre.bpm.in.tum.de/ports/6982/labels/${labelId}"
      );

      if (response.status === 200) {
        console.log("Label deleted successfully");
        // Fetch user labels
        await fetchUserLabels();
      } else {
        console.error("Error deleting label");
      }
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  // Function to handle URL shortening
  const handleShortenUrl = async () => {
    // Set update button clicked state to true
    setUpdateButtonClicked(true);
    try {
      setLoading(true);

      // Send POST request to create shortened URL, API endpoint for creating shortened URL
      const response = await axios.post(
        "https://api.tinyurl.com/create",
        {
          url: urlInput, // URL to be shortened
          domain: "tinyurl.com", // Shortening domain
        },
        {
          // Headers for authentication
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`, // API key for authentication
          },
        }
      );

      // Get the shortened URL
      const result = response.data.data.tiny_url;

      // Display the shortened URL
      const displayedUrl = displayUrl(result);

      // Set the shortened URL state
      setShortenedUrl(displayedUrl);
    } catch (error) {
      console.error("Error creating TinyURL:", error.response || error);
    } finally {
      // Finally block to execute code regardless of error, set loading state to false
      setLoading(false);
    }
  };

  // Function to download image
  const downloadImage = async () => {
    try {
      // For downloading purpose (removed)
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      //a.download = "DYMOPNP_label.png";
      document.body.appendChild(a);
      //a.click();
      document.body.removeChild(a);

      // Send POST request to save image, API endpoint for saving images
      await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/image/saveImage",
        {
          imageData: dataUrl.split(",")[1],
        }
      );

      //Call the resize function
      await resizeImage();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // Function to resize the image
  const resizeImage = async () => {
    try {
      // Send POST request to save image, API endpoint for resizing image locally
      // local-resize executes a shell script (exec) with the package ImageMagick that is processed locally and not on the remote server
      const response = await axios.post("http://localhost:6983/local-resize");
      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to send a request indicating that the print button is clicked
  const printButtonClick = async () => {
    try {
      // Send a POST request to the specified endpoint indicating the print button is clicked (CPEE handling)
      const response = await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/image/setPrintButtonClick"
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to trigger the print button clicked event
  const triggerPrintButtonClicked = async () => {
    try {
      // Send a POST request to the specified endpoint to trigger the print button clicked event (CPEE handling)
      const response = await axios.post(
        "https://lehre.bpm.in.tum.de/ports/6982/image/setTriggerPrintButtonClicked"
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to handle image download
  const handleDownloadImage = async () => {
    // Call function to save state if print button is clicked
    await printButtonClick();

    // Call function to send state if print button is clicked to CPEE instance
    await triggerPrintButtonClicked();

    // Call function to download image
    await downloadImage();

    try {
      // Send POST request to initiate downloads command, API endpoint for downloads command
      // download-command executes a shell script (exec) with the package CUPS that is processed locally and not on the remote server
      const response = await axios.post(
        "http://localhost:6983/download-command"
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" padding="6">
        <Box>
          {loggedInUser ? (
            <Flex alignItems="center">
              <Spacer />
              <LabelList
                labelsLoaded={labelsLoaded}
                loggedInUser={loggedInUser}
                userLabels={userLabels}
                handleShowLabels={handleShowLabels}
                handleUseLabel={handleUseLabel}
                handleDeleteLabelButtonClick={handleDeleteLabelButtonClick}
                showLabels={showLabels}
              />
              <Text fontSize="lg" marginLeft="40px">
                Logged in: {loggedInUser.name}
              </Text>

              <Button
                marginLeft="40px"
                variant="outline"
                colorScheme="black"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </Flex>
          ) : (
            <Flex alignItems="center">
              <Spacer />
              <Button variant="outline" colorScheme="black" onClick={onOpen}>
                Sign up / in
              </Button>{" "}
            </Flex>
          )}
        </Box>
        <Heading as="h1" size="lg" marginTop="40px" fontFamily="">
          Label Manager for DYMO PNP
        </Heading>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isLoginMode ? "Log in" : "Sign up"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoginMode && (
                <div className="login-form">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl marginTop="4">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormControl>

                  <Flex flexDirection="row">
                    <Button
                      type="submit"
                      colorScheme="blue"
                      marginTop="4"
                      marginBottom="4"
                      onClick={handleLogin}
                    >
                      Log in
                    </Button>
                    {!loginStatus.success && (
                      <Text color="red" marginTop="6" marginLeft="6">
                        {loginStatus.message}
                      </Text>
                    )}
                  </Flex>

                  <Text>
                    Don't have an account?{" "}
                    <Link color="blue" onClick={toggleMode}>
                      Sign up
                    </Link>
                  </Text>
                  <ModalBody></ModalBody>
                </div>
              )}

              {!isLoginMode && (
                <div className="registration-form">
                  <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl marginTop="4">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl marginTop="4">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormControl>

                  <Flex flexDirection="row">
                    <Button
                      type="submit"
                      colorScheme="blue"
                      marginTop="4"
                      marginBottom="4"
                      onClick={handleRegistration}
                    >
                      Register
                    </Button>
                    {registrationError && (
                      <Text color="red" marginTop="6" marginLeft="6">
                        {registrationError}
                      </Text>
                    )}
                  </Flex>

                  <Text>
                    Already have an account?{" "}
                    <Link color="blue" onClick={toggleMode}>
                      Log in
                    </Link>
                  </Text>
                  <ModalBody></ModalBody>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
          maxWidth="3xl"
          margin="auto"
          marginTop="30px"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            maxWidth="3xl"
            margin="auto"
            marginTop="30px"
            border="1px solid #ccc"
            borderRadius="md"
            padding="4"
          >
            <Box width="100%" maxWidth="3xl" margin="auto" display="flex">
              <Textarea
                value={inputText}
                onChange={handleTextareaChange}
                placeholder="Enter label text..."
                width="100%"
                padding="8px"
                color="black"
                border="1px solid #cbd5e0"
                borderRadius="md"
                resize="none"
                boxSizing="border-box"
                height="4em"
                overflowY="hidden"
              />
            </Box>

            <Box
              width="100%"
              maxWidth="3xl"
              margin="auto"
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              marginTop="10"
            >
              <Text
                fontSize="lg"
                marginRight={{ base: "0", md: "4" }}
                marginBottom={{ base: "4", md: "0" }}
              >
                Text options:
              </Text>

              <FontSettings
                selectedFont={selectedFont}
                onSelectFont={setSelectedFont}
                fontSize={fontSize}
                onChange={(newFontSize) => setFontSize(newFontSize)}
                marginBottom={{ base: "4", md: "0" }}
              />

              <Spacer marginTop={{ base: "4", md: "0" }} />

              <TextFormattingControls
                isBold={isBold}
                isItalic={isItalic}
                isUnderline={isUnderline}
                onToggleBold={() => setIsBold(!isBold)}
                onToggleItalic={() => setIsItalic(!isItalic)}
                onToggleUnderline={() => setIsUnderline(!isUnderline)}
                marginBottom={{ base: "4", md: "0" }}
              />

              <Spacer marginTop={{ base: "4", md: "0" }} />

              <AlignmentControls
                textAlignLeft={textAlignLeft}
                textAlignCenter={textAlignCenter}
                textAlignRight={textAlignRight}
                toggleAlignment={toggleAlignment}
                verticalAlignTop={verticalAlignTop}
                verticalAlignMiddle={verticalAlignMiddle}
                verticalAlignBottom={verticalAlignBottom}
                toggleVerticalAlignment={toggleVerticalAlignment}
              />
            </Box>
            <Box
              width="100%"
              maxWidth="3xl"
              margin="auto"
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              marginTop="10"
            >
              <Text
                fontSize="lg"
                marginRight={{ base: "0", md: "4" }}
                marginBottom={{ base: "4", md: "0" }}
              >
                QR-Code options:
              </Text>

              <QrCodeToggle
                isChecked={qrCodeVisible}
                onClick={toggleQrCodeVisibility}
                marginBottom={{ base: "4", md: "0" }}
              />

              {qrCodeVisible && (
                <Box
                  marginLeft={{ base: "0", md: "8" }}
                  marginTop={{ base: "5", md: "0" }}
                  marginBottom={{ base: "4", md: "0" }}
                >
                  <QrCodeAlignmentControls
                    qrCodeAlignment={qrCodeAlignment}
                    toggleQrCodeAlignment={toggleQrCodeAlignment}
                  />
                </Box>
              )}

              <Box marginLeft={{ base: "0", md: "8" }}>
                <UrlInputSection
                  qrCodeVisible={qrCodeVisible}
                  urlInput={urlInput}
                  loading={loading}
                  handleUrlInputChange={handleUrlInputChange}
                  handleShortenUrl={handleShortenUrl}
                  generateQRCode={generateQRCode}
                />
              </Box>
            </Box>
          </Box>
          <Box marginTop="80px">
            <Heading as="h1" size="md" marginBottom="7" fontFamily="">
              Label preview
            </Heading>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              maxWidth="3xl"
              margin="auto"
              marginTop="30px"
              border="1px solid #ccc"
              paddingTop="14px"
              paddingBottom="14px"
              paddingLeft="110px"
              paddingRight="110px"
              css={{
                "@media (max-width: 800px)": {
                  transform: "rotate(90deg)",
                  transformOrigin: "center",
                  marginTop: "360px",
                  marginBottom: "330px",
                },
              }}
            >
              <Box>
                <canvas ref={canvasRef} width="531" height="69" />
              </Box>
            </Box>
          </Box>
          <Box
            width="100%"
            maxWidth="3xl"
            margin="auto"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
            justifyContent={{ base: "space-between", md: "space-between" }}
            marginTop="50px"
          >
            <LabelActions
              name={name}
              setName={setName}
              tooltipLabel={tooltipLabel}
              tooltipOpen={tooltipOpen}
              setTooltipOpen={setTooltipOpen}
              handleSaveLabel={handleSaveLabel}
              loggedInUser={loggedInUser}
              handleMouseOver={handleMouseOver}
              handleMouseLeave={handleMouseLeave}
              marginBottom={{ base: "4", md: "0" }}
            />

            <Flex
              flexDirection={{ base: "column", md: "row" }}
              alignItems={{ base: "flex-start", md: "center" }}
              marginTop={{ base: "4", md: "0" }}
            >
              <Button
                colorScheme="teal"
                boxShadow="md"
                onClick={openPrintModal}
                width="120px"
              >
                Print
              </Button>
              <Modal isOpen={isPrintModalOpen} onClose={closePrintModal}>
                <ModalOverlay />
                <ModalContent
                  style={{
                    top: "250px",
                    transform: "translate(-50%, 20%)",
                  }}
                >
                  <ModalHeader
                    textAlign="center"
                    fontSize="2xl"
                    fontWeight="bold"
                    marginTop="10px"
                  >
                    Make sure your DYMO PNP LabelManager is connected
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    <Center>
                      <Button
                        colorScheme="teal"
                        onClick={handleDownloadImage}
                        width="200px"
                      >
                        Yes, print!
                      </Button>
                    </Center>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Flex>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
