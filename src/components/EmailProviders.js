import React from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Button, Checkbox } from "@material-ui/core";

export default function SimpleTable(props) {
  //const [checkedAll, setCheckedAll] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const rowsCount = Object.keys(props.sortedEmails);

  const downloadSelectedFiles = () => {
    selected.map((val) => {
      let emailsContent = props.sortedEmails[val];
      console.log(emailsContent);
      const staticUrl = window.URL.createObjectURL(new Blob([emailsContent]));
      const staticLink = document.createElement("a");
      staticLink.href = staticUrl;
      staticLink.setAttribute("download", val + ".txt"); //or any other extension
      document.body.appendChild(staticLink);
      staticLink.click();
    });
  };

  const handleChange = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangeAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = rowsCount.map((k) => k);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isItemSelected = (name) => selected.indexOf(name) !== -1;

  const tableBody = rowsCount.map((k, i) => (
    <div className="col-4" key={k}>
      <span className="d-flex justify-content-between">
        <span>
          <Checkbox
            checked={isItemSelected(k)}
            onChange={(event) => handleChange(event, k)}
            id={k}
            inputProps={{ "aria-label": "checkbox with default color" }}
          />
          <label htmlFor={k}> {k}</label>
        </span>
        <span className="mt-1 p-2">{props.sortedEmails[k].length}</span>
      </span>
    </div>
  ));

  function ProviderHeader() {
    return (
      <div className="col-4">
        <span className="d-flex justify-content-between">
          <span>
            <label htmlFor="" className="font-weight-bold">
              {" "}
              Providers{" "}
            </label>
          </span>
          <span className="font-weight-bold f-l">Count</span>
        </span>
      </div>
    );
  }

  function DownloadSortedButton(props) {
    const { downloadFilesNum } = props;
    return (
      <div style={{ float: "right" }} className="mt-2">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={downloadSelectedFiles}
          startIcon={<CloudDownloadIcon />}
        >
          {" "}
          Download {downloadFilesNum} files
        </Button>
      </div>
    );
  }
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h5>Email Providers</h5>
          <p className="mb-1">
            <span>
              <Checkbox
                checked={
                  rowsCount.length > 0 && selected.length === rowsCount.length
                }
                onChange={handleChangeAllClick}
                id="selectAll"
                inputProps={{ "aria-label": "checkbox with default color" }}
              />
              <label htmlFor="selectAll">Select All</label>
            </span>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <span className="d-flex justify-content-between">
            <span>
              <label htmlFor="zimbra" className="font-weight-bold">
                {" "}
                Providers{" "}
              </label>
            </span>
            <span className="font-weight-bold f-l">Count</span>
          </span>
        </div>
        {rowsCount.length >= 2 ? <ProviderHeader /> : ""}
        {rowsCount.length >= 3 ? <ProviderHeader /> : ""}
      </div>
      <hr className="my-1" />
      <div className="row">{tableBody}</div>
      {selected.length > 0 ? (
        <DownloadSortedButton downloadFilesNum={selected.length} />
      ) : (
        ""
      )}
    </div>
  );
}
