import React from "react";
import Title from "../components/common/Title";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const SortOptions = (props) => {
  const handleChange = (e) => {
    props.handleChange(e);
  };
  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex mt-2">
          <Title>Sort Options:</Title>
          <Switch
            checked={props.data.showSort}
            onChange={() =>
              props.onUpdateHandler({ showSort: !props.data.showSort })
            }
            color="primary"
            name="showFilter"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
        {props.data.showSort ? (
          <FormControl
            variant="outlined"
            style={{ minWidth: 130 }}
            margin="dense"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Sort By TLD
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-1"
              id="demo-simple-select-outlined"
              value={props.data.tld}
              name="tld"
              onChange={handleChange}
              label="Sort By TLD"
            >
              <MenuItem value="net">net</MenuItem>
              <MenuItem value="com">com</MenuItem>
              <MenuItem value="org">org</MenuItem>
              <MenuItem value="gov">gov</MenuItem>
              <MenuItem value="edu">edu</MenuItem>
              <MenuItem value="mil">mil</MenuItem>
              <MenuItem value="int">int</MenuItem>
            </Select>
          </FormControl>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SortOptions;
