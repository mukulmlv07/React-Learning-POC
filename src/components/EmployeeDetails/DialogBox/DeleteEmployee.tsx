import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DELETE_EMPLOYEE, GET_EMPLOYEES } from "../../../Graphql/Query";
import useDialog from '../DialogBox/useDialog';
import { EmpList } from "../model/EmpList";
import { IoTrashOutline } from "react-icons/io5";

type deleteProps = {
  empId: string,
  empList: EmpList[],
  setEmp: React.Dispatch<React.SetStateAction<EmpList[]>>
}
function DeleteEmployee(props: deleteProps) {
  const [deleteUser] = useMutation(DELETE_EMPLOYEE);

  const clickHandler = () => {
    handleShow()
  }


  const confirm = (flag: boolean) => {
    if (flag) {
      let id = props.empId
      deleteUser({ variables: { ...props }, refetchQueries: [{ query: GET_EMPLOYEES }] });
    }
    handleClose()
  }
  const { handleShow, handleClose, render } = useDialog({ message: 'Do You Really Want To Delete This Employee', heading: 'Delete Employee', confirm: confirm })

  return (
    <>
      {/* <Button variant="primary" className="btn btn-danger" onClick={clickHandler}>Delete</Button> */}
      <IoTrashOutline size="20px" className='action-icon c-p' onClick={clickHandler} />
      {render}
    </>
  )
}

export default DeleteEmployee