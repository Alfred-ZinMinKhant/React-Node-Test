import {
  Button,
  Flex,
  Modal,
  ModalBody,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  Tr,
  Td,
  Spinner,
  Thead,
  Table,
  Tbody,
  Th,
  Checkbox,
} from "@chakra-ui/react";
import DataNotFound from "components/notFoundData";
import Pagination from "components/pagination/Pagination";
import React, { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { putApi } from "services/api";

const RoleUser = (props) => {
  const {
    setUserModal,
    userModal,
    tableData,
    columnsData,
    setOpenUser,
    _id,
    userRole,
    fetchData,
  } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [isloading, setisloading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const data = useMemo(() => tableData, [tableData]);
  const [gopageValue, setGopageValue] = useState();

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const uniqueValues = [...new Set(selectedValues)];

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  useEffect(() => {
    const pre = userRole?.map((item) => item._id);
    setSelectedValues(pre);
  }, [userModal]);

  const addUser = async () => {
    const response = await putApi(
      `api/role-access/assignedUsers/${_id}`,
      uniqueValues
    );
    if (response.status === 200) {
      setUserModal(false);
      fetchData();
    }
  };

  return (
    <Modal
      onClose={() => setUserModal(false)}
      isOpen={userModal}
      isCentered
      size={"4xl"}
      style={{ height: "560px" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent={"space-between"}>
            <Text>Users</Text>
            <ModalCloseButton mt="2" />
          </Flex>
        </ModalHeader>
        <ModalBody overflowY={"auto"} height={"400px"}>
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers?.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(
                        column.isSortable !== false &&
                          column.getSortByToggleProps()
                      )}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        align="center"
                        justifyContent={column.center ? "center" : "start"}
                        fontSize={{ sm: "14px", lg: "16px" }}
                        color=" secondaryGray.900"
                      >
                        <span
                          style={{
                            textTransform: "capitalize",
                            //  marginRight: "8px"
                          }}
                        >
                          {column.render("Header")}
                        </span>
                        {column.isSortable !== false && (
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )}
                          </span>
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {isloading ? (
                <Tr>
                  <Td colSpan={columns?.length}>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text
                      textAlign={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <DataNotFound />
                    </Text>
                  </Td>
                </Tr>
              ) : (
                page?.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row?.getRowProps()} key={i}>
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        if (cell?.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox
                                colorScheme="brandScheme"
                                value={selectedValues}
                                isChecked={selectedValues.includes(cell?.value)}
                                onChange={(event) =>
                                  handleCheckboxChange(event, cell?.value)
                                }
                                me="10px"
                              />
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "email Id") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "first Name") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value ? cell?.value : " - "}
                            </Text>
                          );
                        } else if (cell?.column.Header === "last Name") {
                          data = (
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value ? cell?.value : " - "}
                            </Text>
                          );
                        } else if (cell?.column.Header === "role") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell?.value}
                            </Text>
                          );
                        }
                        return (
                          <Td
                            {...cell?.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                          >
                            {data}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
          {data?.length > 5 && (
            <Pagination
              gotoPage={gotoPage}
              gopageValue={gopageValue}
              setGopageValue={setGopageValue}
              pageCount={pageCount}
              canPreviousPage={canPreviousPage}
              previousPage={previousPage}
              canNextPage={canNextPage}
              pageOptions={pageOptions}
              setPageSize={setPageSize}
              nextPage={nextPage}
              pageSize={pageSize}
              pageIndex={pageIndex}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            onClick={() => {
              addUser();
              setOpenUser(true);
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setUserModal(false);
              setSelectedValues([]);
              setOpenUser(true);
            }}
            variant="outline"
            colorScheme="red"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoleUser;
