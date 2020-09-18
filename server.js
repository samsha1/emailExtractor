const express = require("express");
var multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
const EmailValidator = require("email-deep-validator");
///const formidable = require('express-formidable');

const app = express();
const getTodayDate = Date.now();
const emailValidator = new EmailValidator();
//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
const uploadPath = path.join(__dirname, "src/textFiles"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/textFiles");
  },
  filename: function (req, file, cb) {
    cb(null, getTodayDate + "-" + file.originalname);
  },
});

var upload = multer({ storage }).single("file");

app.post("/api/upload", upload, async (req, res) => {
  const file = req.file;
  const absolutePath = path.join(__dirname, file.path);
  if (absolutePath) {
    return res.status(200).json({
      success: "true",
      message: "file uploaded successfully",
      path: file.path,
      filename: file.originalname,
    });
  }
});

app.post("/api/extract", async (req, res, next) => {
  var meta = req.body;
  const filePath = "src/textFiles/" + meta.filePath;
  const getEmail = await readLargeFile(filePath, meta);
  // const newFile =
  //   "src/textFiles/" + Date.now() + "-ext-" + file.originalname;
  if (getEmail[1] > 0) fs.writeFileSync(filePath, getEmail[0]);

  return res.status(200).json({
    success: "true",
    message: "File Uploaded Successfully!",
    filepath: file.path,
    emails: getEmail[0],
    totalemails: getEmail[1],
  });
});

async function readLargeFile(absolutePath, meta) {
  var a = 0;
  var ingroup = 0;
  let {
    groupby,
    addrString,
    separator,
    getOnly,
    sort,
    otherSeparator,
    tld,
  } = meta;
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
      if (tld) {
        var toplevel = norepeat[k].split(".").pop();
        if (toplevel !== tld) continue;
      }
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
  var counter = email.split(separator).length;
  return [email, counter];
}

app.post("/api/download", (req, res) => {
  //console.log(req.body);
  const file = `${__dirname}/${req.body.file}`;
  //console.log(file);
  res.download(file);
});

app.post("/api/validate", async (req, res) => {
  const separator = req.body.separator;
  const emailToValidate = req.body.outputText.split(separator);
  var validatedEmails = [];
  await Promise.all([
    ...emailToValidate.map(async (email) => {
      const { wellFormed, validDomain, validMailbox } = await validateEachEmail(
        email
      );

      if (wellFormed && validDomain) {
        console.log("Email Verified: " + email);
        validatedEmails.push(email);
      }
    }),
  ]);
  var counter = validatedEmails.length;
  var implodeValidateEmails = validatedEmails.join(separator);

  if (req.body.filepath !== null) {
    const writeToFile = path.join(__dirname, req.body.filepath);
    console.log(writeToFile);
    if (counter > 0) {
      fs.writeFileSync(writeToFile, implodeValidateEmails);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Successfully Validated emails",
    totalEmails: counter,
    emails: implodeValidateEmails,
  });
});

async function validateEachEmail(email) {
  return await emailValidator.verify(email);
}

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
