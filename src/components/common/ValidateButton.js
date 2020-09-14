import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import AlertsPop from "./AlertsPop";

export default function ValidateButton(props) {
  const [loader, setLoader] = React.useState(false);
  const [error, setError] = React.useState(false);
  const validateOutputHandler = () => {
    console.log("Called Validare Output Handler");
    const files = {
      file: props.filepath,
    };
    if (!props.filepath) {
      console.log("Set Error true");
      setError(true);
      return false;
    }

    setLoader(true);

    axios({
      url: "/api/validate",
      method: "POST",
      data: files,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res.data);
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
        disabled={loader}
      >
        {" "}
        {loader ? <CircularProgress disableShrink /> : "Validate"}
      </Button>
      {error ? (
        <AlertsPop
          message="No Emails to Validate."
          key={error}
          onHandleError={setErrorBack}
        />
      ) : (
        ""
      )}
    </div>
  );
}
