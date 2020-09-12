const express = require("express");
var multer = require("multer");
var cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/upload", function (req, res) {
  console.log("File Upload Processing");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res
      .status(200)
      .json({
        "success": "true",
        "message": "File Uploaded Successfully!",
        "name": req.file,
      });
  });
});

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
