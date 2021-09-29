import React, { useReducer, useEffect } from "react";

// Look at how validator works (Input is not responsible for using type of validators but rather checking the type of validator and check that validator)
import { validate } from "../../util/validators";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state, // Copied old values
        value: action.val, // Overrides the values and isValid
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTounched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatchInputState] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    isTounched: false,
  });

  // Don't use props inputState since it might create an infinite loop for every re-evaluation
  const { id, onInput } = props
  const { value, isValid } = inputState
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatchInputState({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  // Initially, the input will not display error when you first see the input. Once you touch it, it will display error if you leave it empty and move your cursor away from the input
  const touchHandler = () => {
    dispatchInputState({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTounched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTounched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
