const express = require("express");
var multer = require("multer");
var cors = require("cors");
const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const path = require("path");
const fs = require("fs-extra");

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());
app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
); // Insert the busboy middle-ware
const uploadPath = path.join(__dirname, "public/files/"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

//var upload = multer({ storage: storage }).single("file");

// app.post("/api/upload", function (req, res) {
//   console.log("File Upload Processing");
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     return res
//       .status(200)
//       .json({
//         "success": "true",
//         "message": "File Uploaded Successfully!",
//         "name": req.file,
//       });
//   });
// });

app.route("/api/upload").post((req, res, next) => {
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);
    console.log(`Upload Path: '${uploadPath}'`);
    // Create a write stream of the new file
    const fstream = fs.createWriteStream(
      path.join(uploadPath, Date.now() + "-" + filename)
    );
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on("close", () => {
      console.log(`Upload of '${filename}' finished`);
      return res.status(200).json({
        success: "true",
        message: "File Uploaded Successfully!",
        name: req.file,
      });
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
