import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Dropdown } from 'semantic-ui-react'
import "./Navbar.css";
import { useMutation } from "@apollo/client";
import { CALCULATE_AVGTIME, LOGOUT_DATA } from "../../Graphql/Query";


type navbarProps = {
  loginTime?: Date;
};

function NavBar({ loginTime = new Date() }: navbarProps) {
  let navigate = useNavigate();

  const location = useLocation();
  const { email, name } = JSON.parse(localStorage?.getItem('loginResponse')!) || location.state;

  const isLoggedIn = JSON.parse(localStorage?.getItem('isLoggedIn')!);
  const [logoutData] = useMutation(LOGOUT_DATA);
  const [calculateAvgTime] = useMutation(CALCULATE_AVGTIME);

  const goToLogin = async () => {
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
   
    const logoutTime = new Date();
    const logoutMinutes = logoutTime.getHours() * 60 + logoutTime.getMinutes();
    const loginMinutes = loginTime.getHours() * 60 + loginTime.getMinutes();
    const t = logoutMinutes - loginMinutes;
    // console.log("timeeee", t, loginMinutes, logoutMinutes);
    const avgdata = await calculateAvgTime({
      variables: { email: email, avgTime: t },
    });
    navigate("/");
    window.location.reload()
  };

  const employeeRender =() => {
    const details = { email, name };
    navigate('/employees', { state: details });
  }

  return (
    <>
      <div className="ui sticky stickyTop">
        <div className="ui inverted segment">
          <div className="ui inverted menu navbar">
            <h2 onClick={()=>  navigate('/dashboard', { state: { email, name } })}>
                Infy Folks
            </h2>
            <a href="" className="item" onClick={() => employeeRender()}>
                Employee Details
            </a>
            <Dropdown
              button
              icon='big user'
              className='ui pointing dropdown top right icon '>
              <Dropdown.Menu>
                  <Dropdown.Header>Name: {name}</Dropdown.Header>
                  <Dropdown.Header>Email Id: {email}</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <button className="ui primary button" onClick={(goToLogin)}>Logout</button>
                  </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

  </>
  );
}


export default NavBar;















{/* <NavDropdown className='dropdown-toggle'
           align="end"
           title={<PersonFill size={40} color="white"/>}
           id="dropdown-menu-align-end">

              
              <NavDropdown.ItemText>
                Welcome Usersdggss
              </NavDropdown.ItemText>
              <NavDropdown.ItemText>
                Email ID: policherla.s@infosys.com
              </NavDropdown.ItemText>

                <NavDropdown.Divider />

                <NavDropdown.Item className='dropdownItem'>
                  <Button onClick={(goToLogin)}>
                      Logout
                  </Button>
              </NavDropdown.Item>

          </NavDropdown>   */}