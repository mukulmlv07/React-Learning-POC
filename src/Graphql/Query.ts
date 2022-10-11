import { gql } from "@apollo/client";

export const LOGIN=gql`
 mutation login($user:loginInput){
  login(userCredentials:$user){
    name
    email
    password
    designation
    phoneNumber
    department
    status

  }
 }
`


export const GET_EMPLOYEES = gql`
  query getEmployees {
    employees {
        empId
        name
        department
        designation
        email
        password
        address
        phoneNumber
        status
      }
  }
`;

export const GET_DEPARTMENTS = gql`
  query getDepartments {
    departments {
        name
        designations
      }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($name: String, $department: String, $designation: String, $address: String!,$phoneNumber: String!, $email: String, $password: String) {
    createEmployee(
        name: $name, 
        designation: $designation, 
        department: $department,
        address: $address, 
        phoneNumber: $phoneNumber,
        email: $email, 
        password: $password
    ) {
      empId
      name
      department
      designation
      email
      password
      address
      phoneNumber
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($empId: String, $name: String, $department: String, $designation: String, $address: String!,$phoneNumber: String!, $email: String, $password: String, $status: Boolean) {
    updateEmployee(
        empId: $empId,
        name: $name, 
        department: $department,
        designation: $designation, 
        address: $address, 
        phoneNumber: $phoneNumber,
        email: $email, 
        password: $password,
        status: $status
    ){
      empId
      name
      department
      designation
      email
      password
      address
      phoneNumber
      status
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($empId: String) {
    deleteEmployee(empId:$empId){
      empId
      name
      department
      designation
      email
      password
      address
      phoneNumber
    }
  }
`;

export const LOGIN_DATA=gql`
mutation loginData($email:String){
  loginData(email:$email)
}
`

export const LOGOUT_DATA=gql`
mutation logoutData($email:String){
  logoutData(email:$email)
}`

export const CALCULATE_AVGTIME=gql`
mutation averageTime($email:String,$avgTime:Int){
  calculateAvgTime(email:$email,avgTime:$avgTime)
}`

export const GET_AVERAGE_TIME=gql`
query getAverageTime($email:String) {
  averageTime(email:$email)
}
`
