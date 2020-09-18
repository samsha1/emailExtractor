import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import AlertsPop from "./AlertsPop";

export default function ValidateButton(props) {
  const [validating, setValidating] = React.useState(false);
  const [error, setError] = React.useState(false);
  const validateOutputHandler = () => {
    if (!props.outputText) {
      setError(true);
      return false;
    }

    props.onUpdateHandler({ loader: !props.loader });
    setValidating(true);
    const text = {
      outputText: props.outputText,
      separator: props.separator,
      filepath: props.filepath,
    };

    axios({
      url: "/api/validate",
      method: "POST",
      data: text,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        props.onUpdateHandler({
          outputText: res.data.emails,
          counter: res.data.totalEmails,
        });
        props.onUpdateHandler({ loader: !props.loader });
        setValidating(false);
      })
      .catch((err) => console.log(err.response.data));
  };

  const setErrorBack = () => {
    setError(false);
  };
  return (
    <div className="ml-2">
      <Button
        variant="contained"
        size="medium"
        color="primary"
        onClick={validateOutputHandler}
        disabled={props.loader}
      >
        {" "}
        {validating ? <CircularProgress disableShrink /> : "Validate"}
      </Button>
      {error ? (
        <AlertsPop
          message="No Emails to Validate."
          onHandleError={setErrorBack}
        />
      ) : (
        ""
      )}
    </div>
  );
}
