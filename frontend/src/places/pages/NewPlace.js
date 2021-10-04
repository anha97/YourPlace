import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import classes from "./PlaceForm.module.css";

const NewPlace = () => {
  const [formState, inputHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
  });

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // Send this to the backend
  };

  return (
    <form className={classes["place-form"]} onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title!"
        onInput={inputHandler}
      />
      <Input
        id="description"
        label="Description"
        element="textarea"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description! (at least 5 characters)"
        onInput={inputHandler}
      />
      <Input
        id="address"
        type="text"
        label="Address"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address!"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
