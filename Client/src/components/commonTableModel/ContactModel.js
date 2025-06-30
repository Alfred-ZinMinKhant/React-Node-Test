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
import React, { useEffect, useState } from "react";
import ContactTable from "./Contact.js";
import Spinner from "components/spinner/Spinner";
import { GiClick } from "react-icons/gi";
import CommonCheckTable from "components/reactTable/checktable.js";
import { fetchContactCustomFiled } from "../../redux/slices/contactCustomFiledSlice.js";
import { fetchContactData } from "../../redux/slices/contactSlice.js";
import { useDispatch } from "react-redux";

const ContactModel = (props) => {
  const { onClose, isOpen, fieldName, setFieldValue, data } = props;
  const [selectedValues, setSelectedValues] = useState();
  const [contactData, setContactData] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [columns, setColumns] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setisloading(true);
      setFieldValue(fieldName, selectedValues);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setisloading(false);
    }
  };
  const fetchCustomDataFields = async () => {
    setisloading(true);
    const result = await dispatch(fetchContactCustomFiled());
    setContactData(result?.payload?.data);

    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...(result?.payload?.data?.[0]?.fields || [])
        .filter((field) => field?.isTableField === true)
        .map((field) => ({ Header: field?.label, accessor: field?.name })),
    ];

    setColumns(tempTableColumns);
    setisloading(false);
  };
  useEffect(async () => {
    await dispatch(fetchContactData());
    fetchCustomDataFields();
  }, []);
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
            <CommonCheckTable
              title={"Contacts"}
              isloading={isloading}
              columnData={columns ?? []}
              // dataColumn={columns ?? []}
              allData={data ?? []}
              tableData={data}
              tableCustomFields={
                contactData?.[0]?.fields?.filter(
                  (field) => field?.isTableField === true
                ) || []
              }
              AdvanceSearch={() => ""}
              ManageGrid={false}
              deleteMany={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              selectType="single"
              customSearch={false}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            me={2}
            onClick={handleSubmit}
            disabled={isloading ? true : false}
            leftIcon={<GiClick />}
          >
            {" "}
            {isloading ? <Spinner /> : "Select"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            colorScheme="red"
            onClick={() => onClose()}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactModel;
