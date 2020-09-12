import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Configure & Run</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={0} alternativeLabel>
          <Step key={0}>
            <StepLabel>Uploading Your File</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>Extracting Emails</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>Processing files to download</StepLabel>
          </Step>
          <Step key={3}>
            <StepLabel>Success</StepLabel>
          </Step>
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
        onClose={handleClose}
        value={value}
      />
    </div>
  );
}
