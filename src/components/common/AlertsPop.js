import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const AlertsPop = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    if (props.handleClipboard) {
      props.handleClipboard();
    } else {
      props.onHandleError();
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={props.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      ></Snackbar>
    </div>
  );
};

export default AlertsPop;
