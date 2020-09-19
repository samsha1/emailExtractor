const express = require("express");
var multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const legit = require("legit");
const bodyParser = require("body-parser");
const EmailValidator = require("email-deep-validator");
///const formidable = require('express-formidable');

const app = express();
const getTodayDate = Date.now();
const emailValidator = new EmailValidator();
//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const absPath = "src/textFiles";

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
const uploadPath = path.join(__dirname, absPath); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, absPath);
  },
  filename: function (req, file, cb) {
    cb(null, getTodayDate + "-" + file.originalname);
  },
});

var upload = multer({ storage }).single("file");

app.post("/api/upload", upload, async (req, res) => {
  const file = req.file;
  absolutePath = path.join(__dirname, file.path);
  if (absolutePath !== "") {
    return res.status(200).json({
      success: "true",
      message: "file uploaded successfully",
      path: path.basename(file.path),
      filename: file.originalname,
    });
  }
});

app.post("/api/extract", async (req, res, next) => {
  var meta = req.body;
  // const filePath = "src/textFiles/" + meta.filePath;
  // const absolutePath = path.join(__dirname, meta.filePath);
  //console.log(absolutePath);
  const getEmail = await readLargeFile(meta);
  // const toFile = path.join(__dirname, absolutePath);
  //console.log(toFile);
  // const newFile =
  //   "src/textFiles/" + Date.now() + "-ext-" + file.originalname;
  // const finalSync = path.join(__dirname, getEmail.filepath);
  // console.log(`After Read Sync:${finalSync}`);
  // console.log(meta.selectedFile);
  const emailFileName =
    path.basename(getEmail.filepath, ".txt") + "-emails.txt";
  const pathEmailFile = path.join(__dirname, absPath + "/" + emailFileName);
  if (getEmail.counter > 0) fs.writeFileSync(pathEmailFile, getEmail.email);
  return res.status(200).json({
    success: "true",
    message: "Successfully Extracted Emails.",
    emails: getEmail.email,
    filepath: path.basename(pathEmailFile),
    totalemails: getEmail.counter,
  });
});

async function readLargeFile(meta) {
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
    selectedFile,
    inputText,
  } = meta;

  console.log(selectedFile);
  if (inputText !== "" && selectedFile === null) {
    var location = path.join(
      __dirname,
      absPath + "/" + Date.now() + "-temp-text.txt"
    );
    fs.writeFileSync(location, inputText);
  } else {
    var location = path.join(__dirname, absPath + "/" + selectedFile);
    var readInitialFile = fs.readFileSync(location, "utf-8");
    fs.appendFileSync(location, inputText, "utf8");
  }

  console.log(`From Read Sync First: ${location}`);

  var rawemail = fs
    .readFileSync(location, "utf-8")
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
  if (email !== undefined) {
    var counter = email.split(separator).length;
  }

  if (inputText !== "" && selectedFile) {
    fs.writeFileSync(location, readInitialFile);
  }

  const response = {
    email: email,
    counter: counter,
    filepath: location,
  };
  return response;
}

app.post("/api/download", (req, res) => {
  //console.log(req.body);
  const file = `${__dirname}${absPath}/${req.body.file}`;
  //console.log(file);
  res.download(file);
});

app.post("/api/validate", async (req, res) => {
  const separator = req.body.separator;
  const rootLocation = path.join(__dirname, absPath + "/" + req.body.filepath);
  const emailToValidate = fs
    .readFileSync(rootLocation, "utf-8")
    .split(separator);
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
    if (counter > 0) {
      fs.writeFileSync(rootLocation, implodeValidateEmails, "utf-8");
    }
  }

  return res.status(200).json({
    success: true,
    message: "Successfully Validated emails",
    totalEmails: counter,
    emails: implodeValidateEmails,
  });
});

app.post("/api/sortemails", async (req, res) => {
  const separator = req.body.separator;
  const sortFileLocation = path.join(
    __dirname,
    absPath + "/" + req.body.filepath
  );

  const emailForSorter = fs
    .readFileSync(sortFileLocation, "utf-8")
    .split(separator);
  var validatedEmails = [];
  await Promise.all([
    ...emailForSorter.map(async (email) => {
      const { isValid, mxArray } = await legit(email);

      if (isValid) {
        let smtp = mxArray[0]["exchange"];
        await checkForServiceProvider(smtp, email);
      }
    }),
  ]);
  var counter = validatedEmails.length;
  var implodeValidateEmails = validatedEmails.join(separator);
});

async function validateEachEmail(email) {
  return await emailValidator.verify(email);
}

async function checkForServiceProvider(smtp, email) {
  const allProviders = "gmail,office365,zimbra,aol,yahoo,godaddy,backspace,qq,netease,263,aliyun,namecheap,networksolutions,hinet,hibox,hiworks,synaq,mweb.co.za,1and1,yandex,cn4e,netvigator,domainlocalhost,comcast,arsmtp,aruba,daum,worksmobile,t-online,protonmail,register.it,naver,mailplug,mail.ru,global-mail.cn,rediffmailpro,serviciodecorreo,redtailtechnology,chinaemail.cn,zmail.net.cn,yzigher,fusemail,barracuda,ukraine,proofpoint,23-reg,strato,postoffice,mimecast,coremail,others".split(
    ","
  );
  var providersEmail = [];
  await Promise.all([
    ...allProviders.map(async (provider) => {
      if (smtp.indexOf(provider) > 0) {
        providersEmail[provider].push(email);
      }
    }),
  ]);
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
