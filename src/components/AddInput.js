import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import SeparatorOptions from "./SeparatorOptions";
import FilterOptions from "./FilterOptions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertsPop from "./common/AlertsPop";

class AddInput extends Component {
  constructor() {
    super();
    this.state = {
      inputText: "",
      outputText: "",
      limitEmail: "",
      disabled: true,
      errors: {},
      isLoading: "",
      showOutput: true,
      showFilter: true,
      separator: "",
      otherSeparator: "",
      getOnly: "",
      group: "",
      addrContainingString: "",
      sort: false,
      copied: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    let isError = this.validate();
    if (!isError) {
      let rawemail = this.state.inputText
        .toLowerCase()
        .match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      this.setState({ outputText: rawemail === null ? "" : rawemail });
    }
  };

  onCheck = (e) => {
    this.setState({
      showOutput: !this.state.showOutput,
    });
  };

  onCheckFilter = (e) => {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  };

  handleClipboard = () => {
    this.setState({
      copied: !this.state.copied,
    });
  };

  onCheckSort = (e) => {
    this.setState({
      sort: !this.state.sort,
    });
  };

  setErrors = (errors) => {
    this.setState({
      errors,
    });
  };

  validate = () => {
    let isError = false;
    //clear form error everytime they submit
    this.setState({ errors: {}, outputText: "" });
    const formErr = {};

    if (this.state.inputText.length === 0) {
      isError = true;
      formErr.inputText = true;
    }

    this.setState({ errors: formErr });

    return isError;
  };

  render() {
    const {
      errors,
      inputText,
      outputText,
      disabled,
      showOutput,
      showFilter,
      copied,
    } = this.state;
    return (
      <div className="row card-box d-flex justify-content-between mb-3 mt-5">
        <div className="col-12 justify-content-between">
          {copied ? <AlertsPop handleClipboard={this.handleClipboard} /> : ""}
          <form onSubmit={this.onSubmit} noValidate>
            <div className="row">
              <div className="col-6">
                <TextAreaFieldGroup
                  placeholder="Input Window"
                  name="inputText"
                  id="inputText"
                  value={inputText}
                  onChange={this.onChange}
                  error={errors.inputText}
                  info="Paste Input"
                  rows="18"
                />
              </div>
              <div
                className="col-6"
                style={{ position: "relative", bottom: "25px" }}
              >
                <CopyToClipboard
                  text={this.state.outputText}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <Tooltip
                    title="Copy to clipboard"
                    style={{
                      float: "right",
                      position: "relative",
                      top: "40px",
                    }}
                  >
                    <IconButton aria-label="Copy to clipboard">
                      <FileCopyIcon color="action" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
                <TextAreaFieldGroup
                  placeholder="Output Window"
                  name="outputText"
                  id="outputText"
                  value={outputText}
                  onChange={this.onChange}
                  error={errors.outputText}
                  disabled={disabled}
                  info="Copy Output"
                  rows="18"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-flex mt-4">
                  <h4>Output Options:</h4>
                  <Switch
                    checked={showOutput}
                    onChange={this.onCheck}
                    color="primary"
                    name="showOutput"
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </div>
                {showOutput ? (
                  <SeparatorOptions
                    data={this.state}
                    handleChange={this.onChange}
                    onCheckSort={this.onCheckSort}
                  />
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-flex mt-4">
                  <h4>Filter Options:</h4>
                  <Switch
                    checked={showFilter}
                    onChange={this.onCheckFilter}
                    color="primary"
                    name="showFilter"
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </div>
                {showFilter ? (
                  <FilterOptions
                    data={this.state}
                    handleChange={this.onChange}
                    setErrors={this.setErrors}
                  />
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="contained"
                type="Submit"
                size="large"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddInput;
