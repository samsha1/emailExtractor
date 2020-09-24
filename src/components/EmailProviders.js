import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 250,
  },
});

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
  const classes = useStyles();

  const isItemSelected = (name) => selected.indexOf(name) !== -1;

  const tableBody = rowsCount.map((k) => (
    <TableRow key={k}>
      <TableCell>
        <Checkbox
          checked={isItemSelected(k)}
          onChange={(event) => handleChange(event, k)}
          inputProps={{ "aria-label": "checkbox with default color" }}
        />
      </TableCell>
      <TableCell component="td" scope="row">
        {k}
      </TableCell>
      <TableCell align="right">{props.sortedEmails[k].length}</TableCell>
    </TableRow>
  ));

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
      <TableContainer component={Paper}>
        <div className="d-flex">
          <Table className={classes.table} aria-label="a dense table" size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Checkbox
                    checked={
                      rowsCount.length > 0 &&
                      selected.length === rowsCount.length
                    }
                    onChange={handleChangeAllClick}
                    inputProps={{ "aria-label": "checkbox with default color" }}
                  />
                </TableCell>
                <TableCell>Providers</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableBody}</TableBody>
          </Table>
        </div>
      </TableContainer>
      {selected.length > 0 ? (
        <DownloadSortedButton downloadFilesNum={selected.length} />
      ) : (
        ""
      )}
    </div>
  );
}
