import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
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

const LabelList = ({
  labelsLoaded,
  loggedInUser,
  userLabels,
  handleUseLabel,
  handleDeleteLabelButtonClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowLabels = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUseLabelAndCloseModal = (label) => {
    handleUseLabel(label);
    handleCloseModal();
  };

  const filteredLabels = userLabels.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reverse the order of filteredLabels
  const reversedLabels = [...filteredLabels].reverse();

  return (
    <>
      <Button onClick={handleShowLabels} colorScheme="blue">
        My saved labels
      </Button>
      {labelsLoaded && loggedInUser && userLabels.length > 0 && (
        <Box mt={8}>
          <Modal isOpen={showModal} onClose={handleCloseModal} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>My saved labels</ModalHeader>
              <ModalBody>
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
