import React, { Component } from "react";
import TextAreaFieldGroup from "./common/TextAreaFieldGroup";
import Button from "@material-ui/core/Button";

class AddInput extends Component {
  constructor() {
    super();
    this.state = {
      inputText: "",
      outputText: "",
      disabled: true,
      errors: {},
      isLoading: "",
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
    const { errors, inputText, outputText, disabled } = this.state;
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
