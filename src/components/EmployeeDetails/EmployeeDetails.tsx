import React, { useState, useEffect } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { EmpList } from './model/EmpList';
import EmployeTable from './EmployeTable/EmployeTable';

// GraphQL
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_EMPLOYEE, GET_DEPARTMENTS, GET_EMPLOYEES } from "../../Graphql/Query";
import NavBar from '../Navbar/NavBar';

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

export type departmentProps = {
    name: string
    designations: string[]
}

function EmployeeDetails() {
    const [userObj, setUserObj] = useState(initialState)
    const [isShow, setShow] = useState<boolean>(false);
    const [emp, setEmp] = useState<EmpList[]>([]);

    const [createEmployee] = useMutation(CREATE_EMPLOYEE);
    const { loading, error, data } = useQuery(GET_EMPLOYEES);
    const lov = useQuery(GET_DEPARTMENTS);

    const [departments, setDepartments] = useState<departmentProps[]>([]);
    const [designations, setDesignations] = useState<string[]>([]);

    useEffect(() => {
        if (error) {
            alert("error");
        } else if (loading) {
            // loading code if any
        } else {
            setEmp(data?.employees)
        }
    }, [loading, error, data])

    useEffect(() => {
        if (lov?.data) {
            setDepartments(lov?.data?.departments)
        }
    }, [lov])

    const addEmployPop = () => {
        setShow(!isShow);
        setUserObj(initialState);
    }

    const handleChane = (e: any, name: any) => {
        setUserObj({
            ...userObj,
            [name]: e.target.value
        })
    }

    const handleDepartSelect = (e: any, name: any) => {
        setUserObj({
            ...userObj,
            department: e.target.value
        })
        let data = departments.find(dep => dep.name === e.target.value);

        if (data) {
            setDesignations(data.designations)
        }
    }

    const AddEmployeeData = () => {
        if (!userObj.name || !userObj.password || !userObj.email || !userObj.department || !userObj.designation || !userObj.phoneNumber || !userObj.address) {
            return Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'All fields are required.',
                showConfirmButton: true
            });
        }

        createEmployee({ variables: { ...userObj }, refetchQueries: [{ query: GET_EMPLOYEES }] });
        setUserObj(initialState);
        setShow(false);

        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `${userObj.name} ${userObj.password}'s data has been Added.`,
            showConfirmButton: false,
            timer: 1500
        });
    }

    return (
        <>
            <NavBar />
            <div className="main-container px-5 py-4">
                <header>
                    <h3>Employee Management Software</h3>
                    <div
                        className='d-flex justify-content-end mb-2'
                    // style={{ marginTop: '30px', marginLeft: 20, marginBottom: 20 }}
                    >
                        <button className='emp-button' onClick={() => addEmployPop()}>Create</button>
                    </div>
                    <Modal show={isShow}>
                        <Modal.Header closeButton onClick={addEmployPop}>
                            <Modal.Title>Add Employee</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Group className="mb-3" controlId="formName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" value={userObj.name} onChange={(e) => handleChane(e, "name")} />
                                        </Form.Group>
                                    </div>
                                    <div className='col'>
                                        <Form.Group className="mb-3" controlId="formPhone">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="text" placeholder="Phone" value={userObj.phoneNumber} onChange={(e) => handleChane(e, "phoneNumber")} />
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
                                            <Form.Select placeholder='Select designation' value={userObj.designation} onChange={(e) => handleChane(e, "designation")}>
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
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Email" value={userObj.email} onChange={(e) => handleChane(e, "email")} />
                                        </Form.Group>
                                    </div>
                                    <div className='col'>
                                        <Form.Group className="mb-3" controlId="formBasicPassword" >
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Enter password" value={userObj.password} onChange={(e) => handleChane(e, "password")} />
                                        </Form.Group>
                                    </div>
                                </div>

                                {/* <div className='row'>
                                <div className='col'>
                                </div>
                                <div className='col'>
                                </div>
                            </div> */}
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Group className="mb-3" controlId="formAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" placeholder="Address" value={userObj.address} onChange={(e) => handleChane(e, "address")} />
                                        </Form.Group>
                                    </div>
                                </div>


                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={addEmployPop}>
                                Close
                            </Button>
                            <Button variant="dark" onClick={AddEmployeeData}>
                                Create
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </header>
                <EmployeTable emp={emp} setEmp={setEmp} />
            </div>
        </>
    )
}

export default EmployeeDetails