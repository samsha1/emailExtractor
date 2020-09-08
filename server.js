const express = require("express");

const app = express();

const port = process.env.PORT || 7000;

//Server Static assets if in a production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Server running on port ${port}`));
