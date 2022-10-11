import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { EmpList } from '../model/EmpList';
import Swal from 'sweetalert2';
import { GET_DEPARTMENTS, GET_EMPLOYEES, UPDATE_EMPLOYEE } from '../../../Graphql/Query';
import { useMutation, useQuery } from '@apollo/client';
import { setEmitFlags } from 'typescript';

const initialState = {
  empId: "",
  name: "",
  department: "",
  designation: "",
  email: "",
  password: "",
  address: "",
  phoneNumber: ""
}

type departmentProps = {
  name: string
  designations: string[]
}

interface Props {
  emp: EmpList[],
  setEmp: React.Dispatch<React.SetStateAction<EmpList[]>>,
  isShow: boolean,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>,
  editData: any
}

const EditEmp: React.FC<Props> = ({ emp, setEmp, isShow, setIsShow, editData }) => {
  const [userObj, setUserObj] = useState(editData)
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const lov = useQuery(GET_DEPARTMENTS);

  const [departments, setDepartments] = useState<departmentProps[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

  useEffect(() => {
    if (lov?.data) {
      setDepartments(lov?.data?.departments)
    }
  }, [lov])

  useEffect(() => {
    setUserObj(editData);

    let data = departments.find(dep => dep.name === editData.department);
    if (data) {
      setDesignations(data.designations)
    }
  }, [editData])


  const closeEditPop = () => {
    setIsShow(!isShow)
  }

  const handleChange = (e: any, name: any) => {
    setUserObj({
      ...userObj,
      [name]: e.target.value
    })
  }

  const handleDepartSelect = (e: any, name: any) => {
    setUserObj({
      ...userObj,
      [name]: e.target.value
    })
    let data = departments.find(dep => dep.name === e.target.value);

    if (data) {
      setDesignations(data.designations)
    }
  }

  const updateEmpPop = () => {
    if (!userObj.name || !userObj.password || !userObj.email || !userObj.phoneNumber || !userObj.address || !userObj.designation || !userObj.department) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      });
    }

    updateEmployee({ variables: userObj, refetchQueries: [{ query: GET_EMPLOYEES }] });
    setUserObj(initialState);
    setIsShow(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${userObj.name} ${userObj.password}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  return (
    <Modal show={isShow}>
      <Modal.Header closeButton onClick={closeEditPop}>
        <Modal.Title>Edit Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className='row'>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={userObj.name} onChange={(e) => handleChange(e, "name")} />
              </Form.Group>
            </div>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" placeholder="Phone" value={userObj.phoneNumber} onChange={(e) => handleChange(e, "phoneNumber")} />
              </Form.Group>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Select placeholder='Select department' value={userObj.department} onChange={(e) => handleDepartSelect(e, "department")}>
                  <option>Select department</option>
                  {
                    departments.map((dep: any) => {
                      return (<option key={dep.name} value={dep.name}>{dep.name}</option>)
                    })
                  }
                </Form.Select>
              </Form.Group>
            </div>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formDesignations">
                <Form.Label>Designation</Form.Label>
                <Form.Select placeholder='Select designation' value={userObj.designation} onChange={(e) => handleChange(e, "designation")}>
                  <option>Select designation</option>
                  {
                    designations.map((des: any) => {
                      return (<option key={des} value={des}>{des}</option>)
                    })
                  }
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" value={userObj.email} onChange={(e) => handleChange(e, "email")} />
              </Form.Group>
            </div>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formBasicPassword" >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" value={userObj.password} onChange={(e) => handleChange(e, "password")} disabled />
              </Form.Group>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Address" value={userObj.address} onChange={(e) => handleChange(e, "address")} />
              </Form.Group>
            </div>
          </div>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeEditPop}>
          Close
        </Button>
        <Button variant="dark" onClick={updateEmpPop}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditEmp