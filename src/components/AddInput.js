import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import SeparatorOptions from "./SeparatorOptions";

class AddInput extends Component {
  constructor() {
    super();
    this.state = {
      inputText: "",
      outputText: "",
      disabled: true,
      errors: {},
      isLoading: "",
      showOutput: true,
      separator: "",
      otherSeparator: "",
      group: "",
      sort: false,
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

  onCheckSort = (e) => {
    this.setState({
      sort: !this.state.sort,
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
    const { errors, inputText, outputText, disabled, showOutput } = this.state;
    return (
      <div className="row card-box d-flex justify-content-between mb-3 mt-5">
        <div className="col-12 justify-content-between">
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
                  rows="6"
                />
              </div>
              <div className="col-6">
                <TextAreaFieldGroup
                  placeholder="Output Window"
                  name="outputText"
                  id="outputText"
                  value={outputText}
                  onChange={this.onChange}
                  error={errors.outputText}
                  disabled={disabled}
                  info="Copy Output"
                  rows="6"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-flex">
                  <h4>Output Options:</h4>
                  <Switch
                    checked={showOutput}
                    onChange={this.onCheck}
                    color="primary"
                    name="checkedB"
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
            <Button
              variant="contained"
              type="Submit"
              size="large"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddInput;
