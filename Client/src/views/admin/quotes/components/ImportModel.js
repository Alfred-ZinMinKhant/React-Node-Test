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
    quotes: "",
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

      if (values.quotes) {
        onClose();
        navigate("/quotesImport", {
          state: { fileData: values.quotes, customFields: customFields },
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
        <ModalHeader>Import Quotes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <CommonFileUpload
                count={values.quotes.length}
                onFileSelect={(file) => setFieldValue("quotes", file)}
                text={text}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.quotes && touched.quotes && <>Please Select {text}</>}
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
