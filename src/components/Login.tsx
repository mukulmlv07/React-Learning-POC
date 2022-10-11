import React, { useReducer, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";

import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN, LOGIN_DATA, GET_AVERAGE_TIME } from "../Graphql/Query";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`,
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
    header: {
      textAlign: "center",
      background: "#212121",
      color: "#fff",
    },
    card: {
      marginTop: theme.spacing(10),
    },
  })
);

//state type

type State = {
  username: string;
  password: string;
  isButtonDisabled: boolean;
  helperText: string;
  isError: boolean;
};

const initialState: State = {
  username: "",
  password: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false,
};

type Action =
  | { type: "setUsername"; payload: string }
  | { type: "setPassword"; payload: string }
  | { type: "setIsButtonDisabled"; payload: boolean }
  | { type: "loginSuccess"; payload: string }
  | { type: "loginFailed"; payload: string }
  | { type: "setIsError"; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload,
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload,
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload,
      };
    case "loginSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false,
      };
    case "loginFailed":
      return {
        ...state,
        helperText: action.payload,
        isError: true,
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload,
      };
  }
};

type loginProps={
  loginTime:Date|undefined,
  setLoginTime:React.Dispatch<React.SetStateAction<Date | undefined>>
}

const Login = (props:loginProps) => {
  let navigate = useNavigate();
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [login] = useMutation(LOGIN);
  const [login, { loading, data, error }] = useMutation(LOGIN);
  const [loginData]=useMutation(LOGIN_DATA)
  // console.log('loginData',loginData)

  useEffect(() => {
    if (state.username.trim() && state.password.trim()) {
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
    } else {
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });
    }
  }, [state.username, state.password]);

  const handleLogin = () => {
    login({
      variables: { user: { email: state.username, password: state.password } },
    })
      .then(async(response) => {
        const details = response?.data?.login;
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("loginResponse", JSON.stringify(details));
        dispatch({
          type: "loginSuccess",
          payload: "Login Successfully",
        })
        const t=new Date()
        // const data=await loginData({variables:{email:state.username}})
        // console.log(data)
        
        props.setLoginTime(t)
        navigate("/dashboard", { state: details});
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: "loginFailed",
          payload: "Incorrect username or password",
        });
      });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setUsername",
      payload: event.target.value,
    });
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setPassword",
      payload: event.target.value,
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Infy Folks" />
        <CardContent>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            onClick={handleLogin}
            disabled={state.isButtonDisabled}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default Login;
