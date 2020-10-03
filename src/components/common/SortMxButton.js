import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import AlertsPop from "./AlertsPop";

export default function SortMxButton(props) {
  const [sorter, setSorter] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const sortMxLookupHandler = () => {
    if (!props.outputText) {
      setError(true);
      setMessage("Extract emails first");
      return false;
    }

    props.onUpdateHandler({ loader: !props.loader });
    setSorter(true);
    const text = {
      separator: props.separator,
      filepath: props.filepath,
    };
    axios({
      url: "/api/sortemails",
      method: "POST",
      data: text,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        props.onUpdateHandler({ loader: false });
        setSorter(false);
        if (res.status === 200) {
          if (res.data.success === true) {
            //console.log(res.data.data);
            props.onUpdateHandler({ sortedEmails: res.data.data });
          }
        }
      })
      .catch((err) => {
        props.onUpdateHandler({ loader: false });
        setSorter(false);
        setError(true);
        setMessage("Something Went Wrong!");
      });
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
        onClick={sortMxLookupHandler}
        disabled={props.loader}
      >
        {" "}
        {sorter ? <CircularProgress size={25} /> : "Sort"}
      </Button>
      {error ? (
        <AlertsPop
          message={message}
          onHandleError={setErrorBack}
          hideduration={message == "Extract emails first" ? 4000 : 60000}
          status="error"
        />
      ) : (
        ""
      )}
    </div>
  );
}
