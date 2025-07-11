import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ContactTable from "./Contact.js";
import Spinner from "components/spinner/Spinner";
import { GiClick } from "react-icons/gi";

const MultiContactModel = (props) => {
  const { onClose, isOpen, fieldName, setFieldValue, data } = props;
  const [selectedValues, setSelectedValues] = useState([]);
  const [isloading, setisloading] = useState(false);

  const columns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "title", accessor: "title" },
    { Header: "first Name", accessor: "firstName" },
    { Header: "last Name", accessor: "lastName" },
    { Header: "phone Number", accessor: "phoneNumber" },
    { Header: "Email Address", accessor: "email" },
    { Header: "physical Address", accessor: "physicalAddress" },
    { Header: "mailing Address", accessor: "mailingAddress" },
    { Header: "Contact Method", accessor: "preferredContactMethod" },
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  const uniqueValues = [...new Set(selectedValues)];

  const handleSubmit = async () => {
    try {
      setisloading(true);
      setFieldValue(fieldName, uniqueValues);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setisloading(false);
    }
  };

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isloading ? (
            <Flex justifyContent={"center"} alignItems={"center"} width="100%">
              <Spinner />
            </Flex>
          ) : (
            <ContactTable
              tableData={data}
              type="multi"
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              columnsData={columns}
              title="Contact"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            onClick={handleSubmit}
            disabled={isloading ? true : false}
            leftIcon={<GiClick />}
          >
            {" "}
            {isloading ? <Spinner /> : "Select"}
          </Button>
          <Button onClick={() => onClose()}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MultiContactModel;
