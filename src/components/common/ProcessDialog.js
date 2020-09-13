import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

function getSteps() {
  return [
    "Uploading Your File",
    "Extracting Emails",
    "Processing files to download",
    "Success",
  ];
}

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, uploadLoading, ...other } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleCancel = () => {
    onClose();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Configure & Run</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {/* <Button onClick={handleOk} color="primary">
          Ok
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
}));

export default function ProcessDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.openDialog);
  const [uploadLoading, setUploadLoading] = React.useState(props.uploadLoading);
  const [value, setValue] = React.useState("Dione");

  const handleClose = (newValue) => {
    // setOpen(!props.openDialog);
    props.handleDialog({ openDialog: !props.openDialog });

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        open={open}
        uploadLoading={uploadLoading}
        onClose={handleClose}
        value={value}
      />
    </div>
  );
}
