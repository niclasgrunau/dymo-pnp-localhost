import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";

// Component for displaying a list of saved labels
const LabelList = ({
  labelsLoaded,
  loggedInUser,
  userLabels,
  handleUseLabel,
  handleDeleteLabelButtonClick,
}) => {
  // State to manage modal visibility and search term
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to show the modal
  const handleShowLabels = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to use a label and close the modal
  const handleUseLabelAndCloseModal = (label) => {
    handleUseLabel(label);
    handleCloseModal();
  };

  // Filter labels based on search term
  const filteredLabels = userLabels.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reverse the order of filteredLabels
  const reversedLabels = [...filteredLabels].reverse();

  return (
    <>
      {/* Button to show saved labels */}
      <Button onClick={handleShowLabels} colorScheme="blue">
        My saved labels
      </Button>
      {/* Render the modal if labels are loaded and user is logged in */}
      {labelsLoaded && loggedInUser && userLabels.length > 0 && (
        <Box mt={8}>
          {/* Modal for displaying saved labels */}
          <Modal isOpen={showModal} onClose={handleCloseModal} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>My saved labels</ModalHeader>
              <ModalBody>
                {/* Input for searching labels */}
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaSearch} color="gray.300" />}
                  />
                  <Input
                    placeholder="Search labels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </ModalBody>
              <ModalCloseButton />
              <ModalBody>
                {/* Table to display labels */}
                <Box maxH="60vh" overflowY="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Label Name</Th>
                        <Th>Creation Date</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* Map through reversedLabels to render each label */}
                      {reversedLabels.map((label) => (
                        <Tr key={label._id}>
                          <Td>{label.name}</Td>
                          <Td>
                            {new Date(label.createdAt).toLocaleDateString()}
                          </Td>
                          <Td>
                            <Flex align="center">
                              <Button
                                onClick={() =>
                                  handleUseLabelAndCloseModal(label)
                                }
                                colorScheme="blue"
                                size="sm"
                              >
                                Use
                              </Button>
                              <Spacer />
                              <FaRegTrashAlt
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                  color: "black",
                                }}
                                onClick={() =>
                                  handleDeleteLabelButtonClick(label._id)
                                }
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </>
  );
};

export default LabelList;
