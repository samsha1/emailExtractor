import React from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import axios from "axios";

export default function DownloadButton(props) {
  const downloadTxtFile = () => {
    const files = {
      file: props.filepath,
    };
    let filename = props.filepath.match(/textFiles\/(.*)/i)[1];
    if (!filename) {
      filename = "yourfile.txt";
    }

    console.log(filename);
    axios({
      url: "/api/download",
      method: "POST",
      responseType: "blob",
      data: files,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); //or any other extension
        document.body.appendChild(link);
        link.click();
        console.log("File Downloaded");
      })
      .catch((err) => console.log("Failed Downloading File"));
  };
  return (
    <div style={{ float: "right" }} className="m-0">
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={downloadTxtFile}
        startIcon={<CloudDownloadIcon />}
      >
        {" "}
        Download {props.counter} emails
      </Button>
    </div>
  );
}
