import React from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function DownloadButton(props) {
  return (
    <div style={{ float: "right" }} className="m-0">
      <Link
        to={props.filepath}
        target="_blank"
        download
        color="primary"
        style={{ textDecoration: "none" }}
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          startIcon={<CloudDownloadIcon />}
        >
          {" "}
          Download {props.counter} emails
        </Button>
      </Link>
    </div>
  );
}
