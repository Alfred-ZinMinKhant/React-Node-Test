import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useState } from "react";
import { toast } from "react-toastify";

const CommonDeleteModel = (props) => {
  const {
    isOpen,
    onClose,
    type,
    handleDeleteData,
    ids,
    selectedValues,
    onDeleteSuccess,
  } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await handleDeleteData(ids, selectedValues);
      toast.success(`The selected ${type} has been successfully deleted.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      onDeleteSuccess();
    } catch (error) {
      toast.error(`An error occurred while deleting the ${type}.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {`${type}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected {`${type}`}?
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            size="sm"
            mr={2}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Yes"}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommonDeleteModel;
