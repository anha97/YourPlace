import React, { useState } from "react";

import { authActions } from "../../store/auth-slice";
import { useDispatch } from "react-redux";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import classes from "./Auth.module.css";
// import { createNextState } from "@reduxjs/toolkit";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
          image: undefined
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
          image: {
            value: null,
            isValid: false,
          }
        },
        false
      );
    }
    setIsLoginMode((prevLoginMode) => !prevLoginMode);
  };

  // You don't need to do anything to the data that after fetching from mongoDB since the login/signup credential is being checked by the backend (Look at users-controller.js), but you might want to
  // get the id from the data since you need it to add it into redux to manage the user's status...
  // If signup/login failed (from backend), you will not run authActions.login (from redux that you can check on store folder).
  // NOTES: The error from backend is passed through the http-hook.js where you manage the useState of the error by catch blocks. Then you acquire the error from the hook to here and pass it on ErrorModal component.
  const authSubmit = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs);

    if (isLoginMode) {
      // Look at user-routes.js inside the backend folder
      // Look at sendRequest inside http-hook.js
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        dispatch(authActions.login({ id: data.user.id })); // It will return true
      } catch (err) {}
    } else {
      try {
        const formData = new FormData(); // New format to send data to the backend instead of using JSON (You can't send file (image) in JSON)
        formData.append("email", formState.inputs.email.value); // Can have both text and file data
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        // Look at user-routes.js inside the backend folder
        const data = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData  // No need to add headers since formData will add that automatically
        );
        dispatch(authActions.login({ id: data.user.id })); // It will return true
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={classes.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
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
          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />}
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
            validators={[VALIDATOR_MINLENGTH(6)]}
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
    </React.Fragment>
  );
};

export default Auth;
