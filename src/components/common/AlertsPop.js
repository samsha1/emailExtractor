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
  console.log(props);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    props.handleClipboard();
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Email addresses copied."
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
      </Snackbar>
    </div>
  );
};

export default AlertsPop;
