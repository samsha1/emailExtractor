import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import AddInput from "./components/AddInput";

export default function ElevateAppBar(props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Advanced Email Sorter V1</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box my={2}>
          <AddInput />
        </Box>
      </Container>
    </React.Fragment>
  );
}
