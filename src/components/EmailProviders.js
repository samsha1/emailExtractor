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

const useStyles = makeStyles({
  table: {
    minWidth: 10,
  },
});

export default function SimpleTable(props) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const classes = useStyles();

  const tableBody = Object.keys(props.sortedEmails).map((k) => 
    <TableRow key={k}>
      <TableCell>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "checkbox with default color" }}
        />
      </TableCell>
      <TableCell component="td" scope="row">
        {k}
      </TableCell>
      <TableCell align="right">{props.sortedEmails[k].length}</TableCell>
    </TableRow>,
  );

  return (
    <TableContainer component={Paper}>
      <div className="d-flex">
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
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
  );
}
