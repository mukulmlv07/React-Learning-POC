import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

export interface AppProps { }

const App: React.FunctionComponent<AppProps> = (props) => {
  const [check, setCheck] = useState(false);
  const [loginTime,setLoginTime]=useState<Date>()
  const isLoggedIn = JSON.parse(localStorage?.getItem('isLoggedIn')!);

  useEffect(() => {
    if (window.location.pathname !== "/" && !isLoggedIn) {
      window.location.href = "/";
    } else {
      setCheck(true);
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login loginTime={loginTime} setLoginTime={setLoginTime}/>} />
          <Route path='/dashboard' element={<Dashboard loginTime={loginTime}/>} />
          <Route path="/employees" element={<EmployeeDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

// <Route path={['/dashboard', '/employees']} element={<Dashboard />} />

export default App;
