import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

const FilterOptions = (props) => {
  const handleChange = (e) => {
    const onValidate = OnChangeValidate(e);
    if (!onValidate) {
      props.handleChange(e);
    }
  };

  const OnChangeValidate = (e) => {
    let isError = false;
    // this.setState({ errors: {} });
    const formErr = {};

    if (e.target.value.length > 4) {
      isError = true;
      formErr.limitEmail = "4 digits max.";
    }

    // this.setState({ errors: formErr });
    props.setErrors(formErr);

    return isError;
  };
  return (
    <div className="d-flex">
      <div>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120 }}
          margin="dense"
        >
          <InputLabel id="demo-simple-select-outlined-label">Choose</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label-1"
            id="demo-simple-select-outlined"
            value={props.data.getOnly}
            name="getOnly"
            onChange={handleChange}
            label="Choose"
          >
            <MenuItem value="only">Only</MenuItem>
            <MenuItem value="donot">Do Not</MenuItem>
          </Select>
        </FormControl>
      </div>
      <p className="ml-2 mt-auto">extract address containing this string:</p>
      <div className="ml-4">
        <TextField
          id="standard-basic"
          label="Enter a Text"
          name="addrContainingString"
          value={props.data.addrContainingString}
          onChange={handleChange}
        />
      </div>
      <div className="ml-4">
        <TextField
          error = {(props.data.errors.limitEmail ? true : false)}
          id="outlined-error-helper-text"
          label="Limit email per domain"
          type="number"
          name="limitEmail"
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          value={props.data.limitEmail}
          variant="outlined"
          helperText={props.data.errors.limitEmail}
        />
      </div>
    </div>
  );
};

export default FilterOptions;
