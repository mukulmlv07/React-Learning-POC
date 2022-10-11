import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
type dialogProps = {
  message: string;
  heading: string;
  confirm: (flag: boolean) => void;
  // clickHandler:(eve:React.Dispatch<React.SetStateAction<boolean>>)=>void
};

function useDialog(props: dialogProps) {
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const clickHandler = (flag: boolean) => {
    props.confirm(flag);
  };

  return {
    confirm: confirm,
    handleShow: handleShow,
    handleClose: handleClose,
    render: (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => clickHandler(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => clickHandler(true)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    ),
  };
}

export default useDialog;
