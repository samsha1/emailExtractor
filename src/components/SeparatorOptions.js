import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const SeparatorOptions = (props) => {
  const handleChange = (e) => {
    props.handleChange(e);
  };
  const ifOther = (
    <div className="ml-4 mt-1">
      <TextField
        id="standard-basic"
        label="Enter Separator"
        name="otherSeparator"
        value={props.data.otherSeparator}
        onChange={handleChange}
      />
    </div>
  );
  return (
    <div className="d-flex">
      <div>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120 }}
          className="mb-2"
          margin="dense"
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Separator
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={props.data.separator}
            name="separator"
            onChange={handleChange}
            label="Separator"
          >
            <MenuItem value=",">Comma</MenuItem>
            <MenuItem value=" | ">Pipe</MenuItem>
            <MenuItem value="; ">Colon</MenuItem>
            <MenuItem value="newline">New Line</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </div>
      {props.data.separator === "other" ? ifOther : ""}
      <div className="ml-4 mt-1">
        <TextField
          id="standard-basic"
          label="Group Addresses"
          name="group"
          value={props.data.group}
          onChange={handleChange}
        />
      </div>
      <div className="ml-4 mt-3">
        <FormControlLabel
          control={
            <Checkbox
              checked={props.data.sort}
              onChange={(e) => {
                props.onCheckSort(e);
              }}
              name="sort"
              color="primary"
            />
          }
          label="Sort"
        />
      </div>
    </div>
  );
};

export default SeparatorOptions;
