import React from "react";
import { CircularProgress, Box, Typography } from "@material-ui/core";

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {props.value}
        </Typography>
      </Box>
    </Box>
  );
}

function getValueForLoader(props) {
  let total = props.counter;
  let processedEmails = props.processedEmails;
  let inPercent = (processedEmails / total) * 100;
  return inPercent.toFixed(0) + "%";
}

export default function SorterMainLoader(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: "30px",
      }}
    >
      {props.sorterLoader ? (
        <CircularProgressWithLabel value={getValueForLoader(props)} size={80} />
      ) : (
        ""
      )}
    </div>
  );
}
