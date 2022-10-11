import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { GET_EMPLOYEES, UPDATE_EMPLOYEE } from "../../../Graphql/Query";
import useDialog from "../DialogBox/useDialog";
import { EmpList } from "../model/EmpList";
import {FaToggleOn, FaToggleOff} from "react-icons/fa"

type statusProps = {
  data: EmpList
} 

function Status(props: statusProps) {
  const [status,setStatus]=useState(true)
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  const clickHandler=()=>{
    handleShow()
  }
  const confirm=(flag:boolean)=>{
    if(flag){
      let updateStatus = {...props.data, status: props.data.status ? false : true }
      updateEmployee({ variables: { ...updateStatus }, refetchQueries: [{ query: GET_EMPLOYEES }] });

      // setStatus(!status)
    }
    handleClose()
  }
  const {handleShow,handleClose,render} = useDialog({message:'Do You Really Want To Chnage Status of Employee',heading:'Change Status',confirm:confirm})

  return (
    <>
      {/* <Button variant="primary" className="btn btn-success" onClick={clickHandler}>{status ? 'Active' : 'Inactive'}</Button> */}
      {
        props.data.status ?
          <FaToggleOn size="20px" className='action-icon c-p' onClick={clickHandler} />
          :
          <FaToggleOff size="20px" className='action-icon c-p' onClick={clickHandler} />
      }
      {/* <Dialog message='Do You Really Want To Chnage Status of Employee' heading='Change Status' clickHandler={clickHandler}/> */}
      {render}
    </>
  )
}

export default Status