// The purpose of this hook is to save the user's input for every keystrokes
// The inputHandler will be executed for every keystrokes (NOTES: It will be used by Input component since it will check validators and so on)
import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        // This will check what input that you're trying to change (title or description)
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          // This will update either title or description, based on action.inputId
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // useCallback will avoid infinite loop since the input component contains useEffect for every changes, causing titleInputHandler to be re-evaluate again, which might trigger useEffect
  // about new changes (new object for titleHandler as onInput)
  // Notes: Probably a good idea to use useEffect and useCallback if you were to call function from child to parent for every input changes
  const inputHandler = useCallback((id, value, isValid) => {
    dispatchFormState({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatchFormState({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
