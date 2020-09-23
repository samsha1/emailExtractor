import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Switch from "@material-ui/core/Switch";
import SeparatorOptions from "./SeparatorOptions";
import SortOptions from "./SortOptions";
import FilterOptions from "./FilterOptions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertsPop from "./common/AlertsPop";
import EmailProviders from "./EmailProviders";
import Title from "../components/common/Title";
import DownloadButton from "../components/common/DownloadButton";
import ValidateButton from "../components/common/ValidateButton";
import PublishIcon from "@material-ui/icons/Publish";
import { Fab, Button, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import SortMxButton from "./common/SortMxButton";

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
      showSort: true,
      separator: ",",
      otherSeparator: "",
      getOnly: "",
      group: "",
      addrContainingString: "",
      sort: false,
      copied: false,
      selectedFile: null,
      extractLoading: false,
      counter: 0,
      filepath: null,
      fileLoading: false,
      loader: false,
      tld: "",
      sortedEmails: null,
    };
    this.onChange = this.onChange.bind(this);
    //this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeFile = (e) => {
    this.setState({ loader: true, fileLoading: true });
    var _validFileExtensions = ["txt", "csv", "mkv"];
    if (e.target.files[0]) {
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
          this.setState({ loader: false, fileLoading: false });
          return false;
        }
      }

      const data = new FormData();
      data.append("file", e.target.files[0]);
      axios({
        url: "/api/upload",
        method: "POST",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) =>
          this.setState({
            loader: false,
            fileLoading: false,
            selectedFile: res.data.path,
            filename: res.data.filename,
          })
        )
        .catch((err) =>
          this.setState({
            loader: false,
            fileLoading: false,
          })
        );
      //this.setState({ loader: false });
      return true;
    }
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    // var outputText = this.state.outputText;
    // var a = 0;
    // var ingroup = 0;
    var groupby = Math.round(this.state.group);
    let string = this.state.addrContainingString;
    let isError = this.validate();
    let getOnly = this.state.getOnly;
    let otherSeparator = this.state.otherSeparator;
    var separator = this.state.separator;
    var doSort = this.state.sort;
    var tld = this.state.tld;
    var inputText = this.state.inputText;
    console.log(isError);
    if (!isError) {
      this.setState({ extractLoading: true, loader: true });
      const exData = {
        selectedFile: this.state.selectedFile,
        groupby,
        addrString: string,
        separator,
        inputText,
        getOnly,
        sort: doSort,
        tld,
        otherSeparator,
      };
      axios
        .post("/api/extract", exData)
        .then((res) =>
          this.setState({
            extractLoading: false,
            loader: false,
            outputText: res.data.emails,
            counter: res.data.totalemails,
            filepath: res.data.filepath,
          })
        )
        .catch((err) => console.log(err));
      return true;
    }
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

  onUpdateHandler = (value) => {
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

    // if (this.state.inputText.length > 0 && this.state.selectedFile) {
    //   isError = true;
    //   formErr.inputText = "Please select one way of input text/file";
    // }
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
      extractLoading,
      counter,
      filepath,
      separator,
      otherSeparator,
      fileLoading,
      loader,
      filename,
      sortedEmails,
    } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          {copied ? (
            <AlertsPop
              handleClipboard={this.handleClipboard}
              message="Emails copied to clipboard."
            />
          ) : (
            ""
          )}
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
                {counter ? (
                  <DownloadButton
                    counter={counter}
                    filepath={filepath}
                    outputText={outputText}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex">
                      <Title>Output Options:</Title>
                      <Switch
                        checked={showOutput}
                        onChange={() =>
                          this.onUpdateHandler({ showOutput: !showOutput })
                        }
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
                        onChange={() =>
                          this.onUpdateHandler({ showFilter: !showFilter })
                        }
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
                <SortOptions
                  onUpdateHandler={this.onUpdateHandler}
                  handleChange={this.onChange}
                  data={this.state}
                />
                <div className="d-flex mt-4">
                  {/* <Title>Have Large Text?</Title> */}

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
                      disabled={loader}
                    >
                      {fileLoading ? (
                        <CircularProgress size={25} />
                      ) : (
                        <PublishIcon />
                      )}{" "}
                      Large Files
                    </Fab>
                  </label>

                  <Typography
                    component="p"
                    variant="caption"
                    style={{
                      position: "relative",
                      top: "10px",
                      textIndent: "10px",
                    }}
                  >
                    {filename ? filename : null}
                  </Typography>
                </div>
                <div className="d-flex mt-4">
                  <div>
                    <Button
                      variant="contained"
                      type="submit"
                      size="medium"
                      color="primary"
                      disabled={loader}
                    >
                      {extractLoading ? (
                        <CircularProgress size={25} />
                      ) : (
                        "Extract"
                      )}
                    </Button>
                  </div>
                  <ValidateButton
                    outputText={outputText}
                    onUpdateHandler={this.onUpdateHandler}
                    separator={otherSeparator ? otherSeparator : separator}
                    loader={loader}
                    filepath={filepath}
                  />
                  <SortMxButton
                    outputText={outputText}
                    onUpdateHandler={this.onUpdateHandler}
                    separator={otherSeparator ? otherSeparator : separator}
                    loader={loader}
                    filepath={filepath}
                  />
                </div>
              </div>
              <div className="col-6">
                {sortedEmails ? (
                  <div>
                    <h4>Email Providers</h4>
                    <EmailProviders sortedEmails={sortedEmails} />
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddInput;
