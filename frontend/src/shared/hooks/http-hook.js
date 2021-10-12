import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  // You need to use useCallback due to useEffect() from Users.js; otherwise, it will create an infinite loop when the hook is re-run, which causes the useEffect() 
  // (that calls sendRequest) to be re-run and then causing sendRequest (new object) and so on...
  // In general, use useCallback if you were to use this function inside useEffect() (?)
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController(); // AbortController() represents a controller object that allows you to abort one or more Web requests as and when desired.
      activeHttpRequests.current.push(httpAbortCtrll);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal, // It adds a signal for this fetch(), which you can use AbortController.abort() to abort the web request
        });

        const data = await response.json();

        // Once we're done with a request, remove abort controller from the array of abort controllers (Filter out this specific request)
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrll
        );

        // Check if there is an error from backend side. If so, throw new Error w/ data.message (data.message is from HttpError() inside backend folder)
        if (!response.ok) {
          throw new Error(data.message);
        }

        setIsLoading(false);
        return data;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  // This will reset the error after encountering one, so you need to create this for ErrorModal component (function in ErrorModal)
  const clearError = () => {
    setError(null);
  };

  // It used to clean up the web requests...
  // When you return the function from the first function, the returned function is executed as a clean up function before the next useEffect() is run again or the component that uses useEffect()
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
