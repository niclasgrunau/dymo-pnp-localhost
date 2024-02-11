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
  const [fetchLabel, setFetchLabel] = useState(true);

  const apiKey = "dklXZ5YlmsgocRzvqUJDewFiniUeV68sfCohvJkQKTzrqQUrwByzXJVzJYxC";

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

  useEffect(() => {
    if (loggedInUser && fetchLabel) {
      fetchUserLabels();
      setFetchLabel(false);
    }

    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
    }

    const getCurrentDateTime = () => {
      const now = new Date();
      return now.toISOString();
    };
    setCreatedAt(getCurrentDateTime());

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    if (qrCodeVisible) {
      generateQRCode();
    } else if (!qrCodeVisible) {
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

  const resetRegistrationError = () => {
    setRegistrationError(null);
  };

  const resetLoginError = () => {
    setLoginStatus(false, "");
  };

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    resetRegistrationError(); // Reset registration error when closing the modal
    resetLoginError();
  };

  const handleShowLabels = () => {
    setShowLabels(!showLabels);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setName("");
    setEmail("");
    setPassword("");
    resetRegistrationError(); // Reset registration error when closing the modal
    resetLoginError();
  };

  const handleMouseOver = () => {
    if (!loggedInUser) {
      setTooltipLabel("Log in to save labels remote");
      setTooltipOpen(true);
    } else if (loggedInUser && !name.trim()) {
      setTooltipLabel("Type in label name");
      setTooltipOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const toggleQrCodeAlignment = () => {
    setQrCodeAlignment((prevAlignment) =>
      prevAlignment === "left" ? "right" : "left"
    );
  };

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

  const toggleQrCodeVisibility = () => {
    if (qrCodeVisible) {
      setUrlInput("");
      setShortenedUrl("");
    }
    setQrCodeVisible(!qrCodeVisible);
  };

  const handleTextareaChange = (event) => {
    const maxLines = 2;
    const inputValue = event.target.value;
    const lines = inputValue.split("\n");
    if (lines.length <= maxLines) {
      setInputText(inputValue);
    }
  };

  const handleUrlInputChange = (event) => {
    setUrlInput(event.target.value);
  };

  const generateQRCode = async () => {
    try {
      const shortenedUrlToDisplay = qrCodeVisible ? shortenedUrl : urlInput;
      setQRCodeData(shortenedUrlToDisplay || "");

      if (qrCodeVisible && shortenedUrlToDisplay) {
        const qrImageDataUrl = await qrcode.toDataURL(shortenedUrlToDisplay, {
          width: 70,
        });
        const qrImage = new Image();
        qrImage.src = qrImageDataUrl;

        qrImage.onload = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          generateImage();
          const qrCodeX = qrCodeAlignment === "left" ? -10 : canvas.width - 80;
          const qrCodeY = (canvas.height - 90) / 2;
          context.drawImage(qrImage, qrCodeX, qrCodeY, 90, 90);
        };
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const canvasRef = useRef(null);

  const toggleAlignment = (alignment) => {
    setTextAlignLeft(alignment === "left");
    setTextAlignCenter(alignment === "center");
    setTextAlignRight(alignment === "right");
  };

  const toggleVerticalAlignment = (alignment) => {
    setVerticalAlignTop(alignment === "top");
    setVerticalAlignMiddle(alignment === "middle");
    setVerticalAlignBottom(alignment === "bottom");
  };

  const generateImage = async () => {
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const qrCodeSize = 90;

      const textStartX = qrCodeVisible ? qrCodeSize : 0;

      let dynamicFontSize = parseFloat(fontSize);
      context.font = `${isBold ? "bold " : ""}${
        isItalic ? "italic " : ""
      }${dynamicFontSize}px ${selectedFont}`;
      context.fillStyle = "black";
      context.textBaseline = "middle";
      const userText = inputText || "";
      const lines = userText.split("\n");

      lines.forEach((line, index) => {
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
        let textWidth = context.measureText(line).width;
        let startX;

        while (textWidth > canvas.width - 2 * textStartX) {
          dynamicFontSize -= 2;
          context.font = `${isBold ? "bold " : ""}${
            isItalic ? "italic " : ""
          }${dynamicFontSize}px ${selectedFont}`;

          textWidth = context.measureText(line).width;
        }

        if (textAlignLeft) {
          startX = textStartX;
        } else if (textAlignRight) {
          startX = canvas.width - textWidth - textStartX;
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

  const handleRegistration = async (e) => {
    e.preventDefault();
    resetRegistrationError();

    try {
      const response = await axios.post(
        "http://localhost:6982/users/register",
        {
          name,
          email,
          password,
        }
      );
      if (response.status === 201) {
        console.log("User registered successfully");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    resetLoginError();

    try {
      const response = await axios.post("http://localhost:6982/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setLoggedInUser(response.data.user);
        onClose();
      } else {
        console.error("Login failed");
        setLoginStatus({ success: false, message: "Wrong Email / Password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus({ success: false, message: "Wrong Email / Password" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    setLoggedInUser(null);
  };

  const handleSaveLabel = async () => {
    try {
      if (!loggedInUser) {
        console.error("User not logged in");
        return;
      }

      const response = await axios.post("http://localhost:6982/labels/save", {
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
      });

      if (response.status === 201) {
        setName("");
        console.log("Label saved successfully");
        await fetchUserLabels();
      } else {
        console.error("Error saving label");
      }
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const fetchUserLabels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6982/labels/user/${loggedInUser._id}`
      );
      setUserLabels(response.data);
      setLabelsLoaded(true);
    } catch (error) {
      console.error("Error fetching user labels:", error);
    }
  };

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

  const displayUrl = (url) => {
    if (url.startsWith("http://")) {
      return url.slice(7);
    } else if (url.startsWith("https://")) {
      return url.slice(8);
    } else {
      return url;
    }
  };

  const handleDeleteLabelButtonClick = async (labelId) => {
    await handleDeleteLabel(labelId);
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const response = await axios.delete(
        `http://localhost:6982/labels/${labelId}`
      );

      if (response.status === 200) {
        console.log("Label deleted successfully");
        await fetchUserLabels();
      } else {
        console.error("Error deleting label");
      }
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const handleShortenUrl = async () => {
    setUpdateButtonClicked(true);
    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.tinyurl.com/create",
        {
          url: urlInput,
          domain: "tinyurl.com",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const result = response.data.data.tiny_url;
      const displayedUrl = displayUrl(result);
      setShortenedUrl(displayedUrl);
    } catch (error) {
      console.error("Error creating TinyURL:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      //kann man löschen am ende ...
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "DYMOPNP_label.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      //... bis hier
      console.log(`1. image download ${new Date().toISOString()}`);
      await axios.post("http://localhost:6982/image/saveImage", {
        imageData: dataUrl.split(",")[1],
      });
      console.log(`5. helfer emthode aufrufen ${new Date().toISOString()}`);

      await helfer();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const helfer = async () => {
    console.log(`6. helfer emthode aufgerufen ${new Date().toISOString()}`);
    try {
      console.log(`7. resize aufgerufen ${new Date().toISOString()}`);

      const response = await axios.post("http://localhost:6982/image/resize");

      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log(`11. helfer methode fertig ${new Date().toISOString()}`);
  };

  const handleDownloadImage = async () => {
    await downloadImage();
    console.log(
      `12. handleDownloadImage starte jetzt ${new Date().toISOString()}`
    );
    try {
      console.log(
        `13. downloads-command aufgerufen ${new Date().toISOString()}`
      );

      const response = await axios.post(
        "http://localhost:6982/image/download-command"
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log(`17. fertig ${new Date().toISOString()}`);
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
            >
              <Box>
                <canvas
                  ref={canvasRef}
                  width={
                    canvasSize === "small" ? 0 : canvasSize === "big" ? 0 : 531
                  }
                  height="69"
                />
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
                onClick={downloadImage}
                marginRight={{ base: "0", md: "10px" }}
                marginBottom={{ base: "4", md: "0" }}
              >
                Download
              </Button>
              <Button
                colorScheme="teal"
                boxShadow="md"
                onClick={handleDownloadImage}
              >
                Print
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
