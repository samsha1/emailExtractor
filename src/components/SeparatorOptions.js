import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const SeparatorOptions = (props) => {
  const handleChange = (e) => {
    props.handleChange(e);
  };
  return (
    <div className>
      <FormControl
        variant="outlined"
        style={{ minWidth: 180 }}
        className="mb-2"
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
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="comma">Comma</MenuItem>
          <MenuItem value="pipe">Pipe</MenuItem>
          <MenuItem value="colon">Colon</MenuItem>
          <MenuItem value="newline">New Line</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SeparatorOptions;
