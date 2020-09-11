import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Switch from "@material-ui/core/Switch";
import SeparatorOptions from "./SeparatorOptions";
import FilterOptions from "./FilterOptions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertsPop from "./common/AlertsPop";
import Title from "../components/common/Title";
import PublishIcon from "@material-ui/icons/Publish";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Fab, Button } from "@material-ui/core";

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
      separator: ",",
      otherSeparator: "",
      getOnly: "",
      group: "",
      addrContainingString: "",
      sort: false,
      copied: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onCheckFilter = this.onCheckFilter.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.onCheckSort = this.onCheckSort.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    // var outputText = this.state.outputText;
    var a = 0;
    var ingroup = 0;
    var groupby = Math.round(this.state.group);
    let string = this.state.addrContainingString;
    let isError = this.validate();
    var separator = this.state.separator;
    if (!isError) {
      var rawemail = this.state.inputText
        .toLowerCase()
        .match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      //this.setState({ outputText: rawemail === null ? "" : rawemail });
      if (separator === "newline") separator = "\n";
      if (separator === "other") separator = this.state.otherSeparator;
      var norepeat = [];
      var filtermail = [];
      if (rawemail) {
        if (string) {
          let x = 0;
          for (var y = 0; y < rawemail.length; y++) {
            if (this.state.getOnly === "only") {
              if (rawemail[y].search(string) >= 0) {
                filtermail[x] = rawemail[y];
                x++;
              }
            } else {
              if (rawemail[y].search(string) < 0) {
                filtermail[x] = rawemail[y];
                x++;
              }
            }
          }
          rawemail = filtermail;
        }
        for (var i = 0; i < rawemail.length; i++) {
          var repeat = 0;

          // Check for repeated emails routine
          for (var j = i + 1; j < rawemail.length; j++) {
            if (rawemail[i] === rawemail[j]) {
              repeat++;
            }
          }

          // Create new array for non-repeated emails
          if (repeat === 0) {
            norepeat[a] = rawemail[i];
            a++;
          }
        }

        if (this.state.sort) norepeat = norepeat.sort();
        var email = "";
        // Join emails together with separator
        for (var k = 0; k < norepeat.length; k++) {
          if (ingroup !== 0) email += separator;
          email += norepeat[k];
          ingroup++;

          // Group emails if a number is specified in form. Each group will be separate by new line.
          if (groupby) {
            if (ingroup === groupby) {
              email += "\n\n";
              ingroup = 0;
            }
          }
        }
      }
      this.setState({ outputText: email });
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
      <div className="row">
        <div className="col-12">
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
                      <FileCopyIcon color="primary" fontSize="small" />
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
                <div style={{ float: "right" }} className="m-0">
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    startIcon={<CloudDownloadIcon />}
                  >
                    {" "}
                    Download (10)
                  </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-flex">
                  <Title>Output Options:</Title>
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
                <div className="d-flex">
                  <Title>Filter Options:</Title>
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
            <div className="d-flex mt-4">
              <Title>Have Large Text?</Title>
              <span className="ml-3">
                <label htmlFor="upload-File">
                  <input
                    style={{ display: "none" }}
                    id="upload-File"
                    name="upload-File"
                    type="file"
                  />

                  <Fab
                    color="primary"
                    size="small"
                    component="span"
                    aria-label="add"
                    variant="extended"
                  >
                    <PublishIcon /> Upload File
                  </Fab>
                </label>
              </span>
            </div>
            <div className="mt-4">
              <Button
                variant="contained"
                type="Submit"
                size="large"
                color="primary"
              >
                Extract
              </Button>
              <Button
                variant="contained"
                type="button"
                size="large"
                color="primary"
                className="ml-2"
              >
                Validate
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddInput;
