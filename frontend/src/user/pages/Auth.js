import React, { useState } from "react";

import { authActions } from "../../store/auth-slice";
import { useDispatch } from "react-redux";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";

import classes from "./Auth.module.css";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchHandler = () => {
    // IMPORTANT: You need to manage the state for input if you were to switch login or signup mode; otherwise, you will not be able to submit
    if (!isLoginMode) {
      // Signup
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // Login
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevLoginMode) => !prevLoginMode);
  };

  const authSubmit = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      dispatch(authActions.login());  // It will return true
      // console.log(isLoggedIn)
    }
    // If you executed authActions.login(), it will go to else statement instead. I think it will be true but I'm not sure it doesn't execute if statement...
    // if (isLoggedIn) {
    //   console.log("It's logged in");
    // } else {
    //   console.log("You signed up instead");
    // }
  };

  return (
    <Card className={classes.authentication}>
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmit}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email!"
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password!"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={switchHandler}>
        SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
      </Button>
    </Card>
  );
};

export default Auth;
