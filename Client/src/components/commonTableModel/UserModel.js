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
import Spinner from "components/spinner/Spinner";
import { GiClick } from "react-icons/gi";
import CommonCheckTable from "components/reactTable/checktable";
import { fetchLeadCustomFiled } from "../../redux/slices/leadCustomFiledSlice";
import { useDispatch } from "react-redux";
import { getApi } from "services/api";

const UserModel = (props) => {
  const {
    onClose,
    isOpen,
    fieldName,
    setFieldValue,
    data,
    isloading,
    setisloading,
  } = props;
  const title = "Users";
  const dispatch = useDispatch();
  // const [data, setData] = useState([]);

  // const [isloading, setisloading] = useState(false);
  const [leadData, setLeadData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

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
  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: "email Id",
      accessor: "username",
    },
    { Header: "first Name", accessor: "firstName" },
    { Header: "last Name", accessor: "lastName" },
    { Header: "role", accessor: "role" },
  ];

  // const [columns, setColumns] = useState([...tableColumns]);
  // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

  // const fetchData = async () => {
  //     setisloading(true)
  //     let result = await getApi('api/user/');
  //     setData(result?.data?.user);
  //     setisloading(false)
  // }
  // useEffect(() => {
  //     fetchData()
  // }, [])

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isloading ? (
            <Flex justifyContent={"center"} alignItems={"center"} width="100%">
              <Spinner />
            </Flex>
          ) : (
            <CommonCheckTable
              title={title}
              isloading={isloading}
              columnData={tableColumns ?? []}
              // dataColumn={columns ?? []}
              allData={data ?? []}
              tableData={data}
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
            disabled={isloading ? true : false}
            leftIcon={<GiClick />}
            onClick={handleSubmit}
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

export default UserModel;
