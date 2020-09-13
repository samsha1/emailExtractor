import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Switch from "@material-ui/core/Switch";
import SeparatorOptions from "./SeparatorOptions";
import FilterOptions from "./FilterOptions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertsPop from "./common/AlertsPop";
import Title from "../components/common/Title";
import PublishIcon from "@material-ui/icons/Publish";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Fab, Button, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

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
      selectedFile: null,
      uploadLoading: false,
      counter: 0,
    };
    this.onChange = this.onChange.bind(this);
    //this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeFile = (e) => {
    var _validFileExtensions = ["txt", "csv"];
    var fileName = e.target.files[0].name;
    if (fileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (
          fileName
            .substr(
              fileName.length - sCurExtension.length,
              sCurExtension.length
            )
            .toLowerCase() === sCurExtension.toLowerCase()
        ) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        alert(
          "Sorry, " +
            fileName +
            " is invalid, allowed extensions are: " +
            _validFileExtensions.join(", ")
        );
        return false;
      }
    }

    this.setState({ selectedFile: e.target.files[0] });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    // var outputText = this.state.outputText;
    var a = 0;
    var ingroup = 0;
    var groupby = Math.round(this.state.group);
    let string = this.state.addrContainingString;
    let isError = this.validate();
    let getOnly = this.state.getOnly;
    let otherSeparator = this.state.otherSeparator;
    var separator = this.state.separator;
    var doSort = this.state.sort;
    if (!isError) {
      if (this.state.selectedFile) {
        this.setState({ uploadLoading: true, openDialog: true });
        const data = new FormData();
        data.append("file", this.state.selectedFile);
        data.append("groupby", groupby);
        data.append("addrString", string);
        data.append("separator", separator);
        data.append("getOnly", getOnly);
        data.append("sort", doSort);
        data.append("otherSeparator", otherSeparator);
        axios({
          url: "/api/upload",
          method: "POST",
          data: data,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) =>
            this.setState({
              uploadLoading: false,
              outputText: res.data.emails,
              counter: res.data.totalemails,
            })
          )
          .catch((err) => console.log(err));
        //return true;
      }
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
          console.log(rawemail.length);
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

  handleDialog = (value) => {
    // const { key, val } = value;
    // console.log(value);
    this.setState(value);
  };

  validate = () => {
    let isError = false;
    //clear form error everytime they submit
    this.setState({ errors: {}, outputText: "" });
    const formErr = {};

    if (this.state.inputText.length === 0 && !this.state.selectedFile) {
      isError = true;
      formErr.inputText = true;
    }

    if (this.state.inputText.length > 0 && this.state.selectedFile) {
      isError = true;
      formErr.inputText = "Please select one way of input text/file";
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
      selectedFile,
      uploadLoading,
      counter,
    } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          {copied ? <AlertsPop handleClipboard={this.handleClipboard} /> : ""}
          <form onSubmit={this.onSubmitHandler} noValidate>
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
                    onChange={this.onChangeFile}
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
              <Typography
                component="p"
                variant="caption"
                style={{
                  position: "relative",
                  top: "10px",
                  textIndent: "10px",
                }}
              >
                {selectedFile ? selectedFile.name : null}
              </Typography>
            </div>
            <div className="mt-4">
              <Button
                variant="contained"
                type="submit"
                size="large"
                color="primary"
                disabled={uploadLoading}
              >
                {uploadLoading ? <CircularProgress disableShrink /> : "Extract"}
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
