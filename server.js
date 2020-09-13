const express = require("express");
var multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
///const formidable = require('express-formidable');

const app = express();
const getTodayDate = Date.now();

//Body Parser Middleware
//app.use(formidable());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());
// app.use(
//   busboy({
//     highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
//   })
// ); // Insert the busboy middle-ware
const uploadPath = path.join(__dirname, "/textFiles"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/textFiles");
  },
  filename: function (req, file, cb) {
    cb(null, getTodayDate + "-" + file.originalname);
  },
});

var upload = multer({ storage }).single("file");

app.post("/api/upload", upload, async (req, res, next) => {
  const file = req.file;
  var meta = req.body;
  const absolutePath = path.join(__dirname, file.path);
  const getEmail = await readLargeFile(absolutePath, meta);
  const newFile = "/textFiles/" + Date.now() + "-ext-" + file.originalname;
  if (getEmail[1] > 0)
    await fs.writeFileSync(
      newFile,
      getEmail[0]
    );

  return res.status(200).json({
    success: "true",
    message: "File Uploaded Successfully!",
    filepath: newFile,
    emails: getEmail[0],
    totalemails: getEmail[1],
  });
});

function readLargeFile(absolutePath, meta) {
  var a = 0;
  var ingroup = 0;
  let { groupby, addrString, separator, getOnly, sort, otherSeparator } = meta;
  var rawemail = fs
    .readFileSync(absolutePath, "utf-8")
    .toLowerCase()
    .match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  if (separator === "newline") separator = "\n";
  if (separator === "other") separator = otherSeparator;
  var norepeat = [];
  var filtermail = [];
  if (rawemail) {
    if (addrString) {
      console.log("Got Address String");
      let x = 0;
      for (var y = 0; y < rawemail.length; y++) {
        if (getOnly === "only") {
          if (rawemail[y].search(addrString) >= 0) {
            filtermail[x] = rawemail[y];
            x++;
          }
        } else {
          if (rawemail[y].search(addrString) < 0) {
            filtermail[x] = rawemail[y];
            x++;
          }
        }
      }
      rawemail = filtermail;
    }

    for (var i = 0; i < rawemail.length; i++) {
      var repeat = 0;

      // Check for repeated emails routine
      for (var j = i + 1; j < rawemail.length; j++) {
        if (rawemail[i] === rawemail[j]) {
          repeat++;
        }
      }

      // Create new array for non-repeated emails
      if (repeat === 0) {
        norepeat[a] = rawemail[i];
        a++;
      }
    }

    if (Boolean(sort)) norepeat = norepeat.sort();
    var email = "";
    // Join emails together with separator
    for (var k = 0; k < norepeat.length; k++) {
      if (ingroup !== 0) email += separator;
      email += norepeat[k];
      ingroup++;

      // Group emails if a number is specified in form. Each group will be separate by new line.

      if (groupby) {
        if (ingroup === Number(groupby)) {
          email += "\n\n";
          ingroup = 0;
        }
      }
    }
  }
  //console.log(email);
  var counter = norepeat.length;
  return [email, counter];
}

// app.route("/api/upload").post((req, res, next) => {
//   //console.log(req.fields);
//   // files.map(file => {
//   //   console.log(file)
//   // })
//   req.pipe(req.files.map().busboy); // Pipe it trough busboy

//   req.busboy.on("file", (fieldname, file, filename) => {
//     console.log(`Upload of '${filename}' started`);
//     console.log(`Upload Path: '${uploadPath}'`);
//     // Create a write stream of the new file
//     const namingFile = Date.now() + "-" + filename.replace(/ /g,'-').toLowerCase();
//     const fstream = fs.createWriteStream(
//       path.join(uploadPath, namingFile)
//     );
//     // Pipe it trough
//     file.pipe(fstream);

//     // On finish of the upload
//     fstream.on("close", () => {
//       console.log(`Upload of '${namingFile}' finished`);
//       return res.status(200).json({
//         success: "true",
//         message: "File Uploaded Successfully!",
//         filename: namingFile,
//       });
//     });
//   });
// });

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
