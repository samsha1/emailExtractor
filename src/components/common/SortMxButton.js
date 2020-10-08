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

    props.onUpdateHandler({ loader: true });
    props.onUpdateHandler({ sorterLoader: true });
    props.onUpdateHandler({ processedEmails: 0 });

    setSorter(true);
    const text = {
      separator: props.separator,
      filepath: props.filepath,
    };
    axios({
      url: "/api/setsortstat",
      method: "POST",
      data: text,
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        props.onUpdateHandler({ sorterLoader: true });
        let unique_id = resp.data.unique_id;
        getSorterStat(unique_id);
        axios
          .post("/api/sortemails", { unique_id, separator: props.separator })
          .then((res) => {
            props.onUpdateHandler({ loader: false });
            setSorter(false);
            if (res.status === 200) {
              if (res.data.success === true) {
                //console.log(res.data.data);
                props.onUpdateHandler({ sorterLoader: false });
                props.onUpdateHandler({ sortedEmails: res.data.data });
              }
            }
          })
          .catch((err) => {
            props.onUpdateHandler({ loader: false });
            props.onUpdateHandler({ sorterLoader: false });
            setSorter(false);
            setError(true);
            setMessage("Something Went Wrong!");
          });
      })
      .catch((err) => {
        props.onUpdateHandler({ loader: false });
        props.onUpdateHandler({ sorterLoader: false });
        setSorter(false);
        setError(true);
        setMessage("Something Went Wrong!");
      });
  };

  const setErrorBack = () => {
    setError(false);
  };

  async function getSorterStat(id) {
    axios.get(`/api/getsortstat/${id}`).then((res) => {
      if (res.data.status === "completed" || error === true) {
        console.log("Sorting Completed");
        props.onUpdateHandler({ loader: false });
        props.onUpdateHandler({ sorterLoader: false });
        setSorter(false);
        // if (res.status === 200) {
        //   if (res.data.success === true) {
        //     //console.log(res.data.data);
        //     props.onUpdateHandler({ sortedEmails: res.data.data });
        //   }
        // }
      } else {
        props.onUpdateHandler({ processedEmails: res.data.count });
        setTimeout(() => {
          getSorterStat(id);
        }, 5000);
      }
    });
  }
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
          hideduration={message === "Extract emails first" ? 4000 : 60000}
          status="error"
        />
      ) : (
        ""
      )}
    </div>
  );
}
