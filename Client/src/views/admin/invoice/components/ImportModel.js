import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonFileUpload from "components/commonFileUpload";

const ImportModal = (props) => {
  const { onClose, isOpen, text, customFields } = props;
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    invoices: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      AddData();
      resetForm();
    },
  });
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

  const AddData = async () => {
    try {
      setisloading(true);
      resetForm();

      if (values.invoices) {
        onClose();
        navigate("/invoicesImport", {
          state: { fileData: values.invoices, customFields: customFields },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setisloading(false);
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Invoices</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <CommonFileUpload
                count={values.invoices.length}
                onFileSelect={(file) => setFieldValue("invoices", file)}
                text={text}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.invoices && touched.invoices && (
                  <>Please Select {text}</>
                )}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="brand"
            onClick={handleSubmit}
            disabled={isloading ? true : false}
          >
            {isloading ? <Spinner /> : "Save"}
          </Button>
          <Button
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportModal;
