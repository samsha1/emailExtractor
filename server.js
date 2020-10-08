const express = require("express");
var multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const keys = require("./config/keys");
const mongoose = require("mongoose");

// const legit = require("legit");
const dns = require("dns");
const bodyParser = require("body-parser");
const EmailValidator = require("email-deep-validator");
process.env.UV_THREADPOOL_SIZE = 128;
///const formidable = require('express-formidable');

const app = express();
const getTodayDate = Date.now();
const emailValidator = new EmailValidator();

//connect mongo
const db = keys.mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));
const Sorter = require("./models/Sorter");

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const absPath = "src/textFiles";
const allProviders = "gmail,microsoft,zimbra,aol,yahoo,godaddy,backspace,qq,netease,263,aliyun,namecheap,networksolutions,hinet,hibox,hiworks,synaq,mweb.co.za,1and1,yandex,cn4e,netvigator,domainlocalhost,comcast,arsmtp,aruba,daum,worksmobile,t-online,protonmail,register.it,naver,mailplug,mail.ru,global-mail.cn,rediffmailpro,serviciodecorreo,redtailtechnology,chinaemail.cn,zmail.net.cn,yzigher,fusemail,barracuda,ukraine,proofpoint,123-reg,strato,postoffice,mimecast,coremail,outlook,hotmail,office365,msn,live,google,googlemail,cloudfare,yahoodns".split(
  ","
);

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
    limitEmail,
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
  //console.log(rawemail);
  if (separator === "newline") separator = "\n";
  if (separator === "other") separator = otherSeparator;
  var norepeat = [];
  var filtermail = [];
  var emailAfterLimited = [];
  var listedLimitedEmails = [];
  if (rawemail) {
    if (limitEmail && limitEmail > 0) {
      let b = 0;
      for (var a = 0; a < rawemail.length; a++) {
        var limitDomainTld = rawemail[a].split(".").pop();
        if (listedLimitedEmails[limitDomainTld]) {
          if (listedLimitedEmails[limitDomainTld] >= limitEmail) {
            // console.log(
            //   `Max Count for ${limitEmail} is done. so, excluding: ${rawemail[a]}`
            // );
            continue;
          }
          listedLimitedEmails[limitDomainTld] =
            listedLimitedEmails[limitDomainTld] + 1;
        } else {
          listedLimitedEmails[limitDomainTld] = 1;
        }
        emailAfterLimited[b] = rawemail[a];
        b++;
        //console.log(listedLimitedEmails);
      }

      rawemail = emailAfterLimited;
    }
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
    //console.log(rawemail);
    // for (var i = 0; i < rawemail.length; i++) {
    //   var repeat = 0;

    //   // Check for repeated emails routine
    //   for (var j = i + 1; j < rawemail.length; j++) {
    //     if (rawemail[i] === rawemail[j]) {
    //       repeat++;
    //     }
    //   }

    //   // Create new array for non-repeated emails
    //   if (repeat === 0) {
    //     norepeat[a] = rawemail[i];
    //     a++;
    //   }
    // }

    //console.log(norepeat);
    norepeat = Array.from(new Set(rawemail));
    //console.log(norepeat);

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
  const file = `${__dirname}/${absPath}/${req.body.file}`;
  //console.log(file);
  res.download(file);
});

app.post("/api/validate", async (req, res) => {
  const separator = req.body.separator;
  const rootLocation = path.join(__dirname, absPath + "/" + req.body.filepath);
  const emailToValidate = fs
    .readFileSync(rootLocation, "utf-8")
    .replace(/\n/g, separator)
    .split(separator);
  console.log(emailToValidate);
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

app.get("/api/getsortstat/:unique_id", (req, res) => {
  const errors = {};
  Sorter.findOne({ unique_id: req.params.unique_id })
    .then((sortData) => {
      if (!sortData) {
        errors.message = "Invalid Sorter Request";
        res.status(404).json(errors);
      }
      res.json(sortData);
    })
    .catch((err) => res.status(400).json({ message: "No Request Found" }));
});

app.post("/api/setsortstat", async (req, res) => {
  let unique_id = JSON.stringify(Math.floor(Date.now() / 1000));
  const emailStat = new Sorter({
    unique_id,
    name: req.body.filepath,
    count: 0,
    status: "processing",
  });
  emailStat
    .save()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(400).json({
        status: "error",
        message: "something went wrong!",
      });
    });
});

async function saveProviderStat(unique_id, totalEmails, status) {
  const emailStat = {
    count: totalEmails,
    status: status,
  };
  console.log(`Total Emails Received: ${totalEmails} Status: ${status}`);
  await Sorter.findOne({ unique_id: unique_id }).then(async (sorter) => {
    console.log(sorter);
    if (sorter) {
      await Sorter.findOneAndUpdate(
        { _id: sorter._id },
        { $set: emailStat },
        { new: true }
      )
        .then((sorter) => {
          console.log(sorter);
          return { sorter };
        })
        .catch((err) => {
          console.log(err);
          return { err };
        });
    }
  });
}

app.post("/api/sortemails", async (req, res) => {
  const separator = req.body.separator;
  const unique_id = req.body.unique_id;
  Sorter.findOne({ unique_id })
    .then((sortData) => {
      console.log(sortData);
      if (!sortData) {
        errors.message = "Invalid Sorter Request";
        res.status(404).json(errors);
      }
      const sortFileLocation = path.join(
        __dirname,
        absPath + "/" + sortData.name
      );
      const emailForSorter = fs
        .readFileSync(sortFileLocation, "utf-8")
        .replace(/\n/g, separator)
        .split(separator);
      var validatedEmails = {};
      var totalEmails = 0;
      Promise.all([
        ...emailForSorter.map(async (email) => {
          var foundProviderWithoutLegit = false;
          var regEmail = email.match(/@(.*?)\./i)[1];
          allProviders.map(async (rawprovider) => {
            if (foundProviderWithoutLegit === false) {
              if (regEmail == rawprovider) {
                let provider = await checkCommonProvider(rawprovider);
                console.log(provider);
                if (validatedEmails[provider]) {
                  let providers = validatedEmails[provider].length;
                  console.log(
                    `Sorted Emails Without Legit Libary: ${provider}` +
                      " " +
                      email
                  );
                  console.log(`Total Email: ${providers}`);
                  validatedEmails[provider][providers] = email;
                  totalEmails++;
                } else {
                  //console.log("Sorted Emails first time: " + email);
                  validatedEmails[provider] = [email];
                  totalEmails++;
                }
                foundProviderWithoutLegit = true;
              }
            }
          });
          //await saveProviderStat(unique_id, totalEmails, "processing");
          if (foundProviderWithoutLegit === false) {
            console.log(`Sorting Emails with Legit Libary:` + " " + email);
            try {
              const { isValid, mxArray } = await validateEmailAddress(email);
              console.log(isValid);
              console.log(mxArray);
              //throw new Error("Stoop now");
              if (isValid) {
                // let smtp = mxArray[0]["exchange"];
                console.log("EMAIL VALID For Email: " + email);
                const sortedEmails = await checkForServiceProvider(
                  mxArray,
                  email
                );
                if (validatedEmails[sortedEmails.provider]) {
                  console.log(
                    "Added To Associated Provider: " + sortedEmails.provider
                  );
                  let providers = validatedEmails[sortedEmails.provider].length;
                  validatedEmails[sortedEmails.provider][providers] =
                    sortedEmails.email;
                  totalEmails++;
                  console.log(`Total Email: ${providers}`);
                } else {
                  totalEmails++;
                  validatedEmails[sortedEmails.provider] = [sortedEmails.email];
                }
              } else {
                console.log("EMAIL invalid for: " + email);
                if (validatedEmails["No-mx"]) {
                  let othersP = validatedEmails["No-mx"].length;
                  validatedEmails["No-mx"][othersP] = email;
                } else {
                  validatedEmails["No-mx"] = [email];
                }
                totalEmails++;
              }
            } catch (e) {
              console.log("EMAIL Exception for: " + email);
              console.log("Exception Message: " + e.message);
              if (validatedEmails["No-mx"]) {
                let othersP = validatedEmails["No-mx"].length;
                validatedEmails["No-mx"][othersP] = email;
                totalEmails++;
              } else {
                validatedEmails["No-mx"] = [email];
                totalEmails++;
              }
            }
            // await saveProviderStat(unique_id, totalEmails, "processing");
          }
        }),
        setTimeout(() => {
          saveProviderStat(unique_id, totalEmails, "processing");
        }, 5000),
      ])
        .then(() => {
          saveProviderStat(unique_id, totalEmails, "completed");
          return res.status(200).json({
            success: true,
            message: "Successfully Sorted emails",
            data: validatedEmails,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.status(200).json({
            success: false,
            message: "Something Went Wrong!",
            data: {},
          });
        });
    })
    .catch((err) => res.status(400).json({ message: "Something went wrong!" }));
});

async function validateEachEmail(email) {
  return await emailValidator.verify(email);
}

async function mxLookup(domain, retryTimes, retryDelay, callback) {
  var cntr = 0;
  async function run() {
    // try your async operation
    dns.resolveMx(domain, function (err, data) {
      ++cntr;
      if (err) {
        if (cntr >= retryTimes) {
          // if it fails too many times, just send the error out
          console.log("Failed Too Many Times: " + cntr);
          callback(err);
        } else {
          // try again after a delay
          console.log("Trying Again: " + retryTimes);
          setTimeout(run, retryDelay);
        }
      } else {
        // success, send the data out
        callback(err, data);
      }
    });
  }

  run();
  // var callbackCalled = false;
  // var doCallback = function (err, domains) {
  //   if (callbackCalled) return;
  //   callbackCalled = true;
  //   callback(err, domains);
  // };

  // setTimeout(function () {
  //   doCallback(new Error("Timeout exceeded"), null);
  // }, timeout);

  // dns.resolveMx(domain, doCallback);
}

const validateEmailAddress = (emailAddress) => {
  return new Promise((resolve, reject) => {
    const splitEmail = emailAddress.split("@");
    mxLookup(splitEmail[1], 10, 500, function (err, mx) {
      // if (err) {
      //   console.log("Err: " + err);
      //   return;
      // }

      //console.log("Checking mx: " + mx[0]["exchange"]);
      //console.log(mx);

      //throw new Error("Whatever");
      if (typeof mx != "undefined") {
        mx
          ? resolve({ isValid: true, mxArray: mx })
          : resolve({ isValid: false, mxArray: null });
      } else if (err.code == "ENOTFOUND") {
        console.log("Email Not Found: " + emailAddress);
        resolve({ isValid: false, mxArray: null, mxRecordSetExists: false });
      } else {
        console.log("Error Exception from ETimeOut: " + err.code);
        reject(new Error(err.code));
      }
    });
  });
};

async function checkForServiceProvider(mxArray, email) {
  var providersEmail = {};
  var foundProvider = false;
  //console.log(mxArray);
  await allProviders.map(async (provider) => {
    if (foundProvider === false) {
      await mxArray.map(async (exc) => {
        let exchange = exc["exchange"].toLowerCase().split(".");
        console.log(exchange);
        console.log(exchange[exchange.length - 2]);
        if (foundProvider === false) {
          console.log("False Provider: " + provider);
          if (exchange[exchange.length - 2] == provider) {
            providersEmail.provider = await checkCommonProvider(provider);
            providersEmail.email = email;
            foundProvider = true;
          }
        }
      });
    }
  });
  // console.log(providersEmail);
  if (Object.keys(providersEmail).length === 0) {
    providersEmail.provider = "Others";
    providersEmail.email = email;
  }
  // console.log(providersEmail);
  return providersEmail;
}

async function checkCommonProvider(provider) {
  let microsoftEmails = [
    "outlook",
    "hotmail",
    "office365",
    "microsoft",
    "msn",
    "live",
  ];

  let googlEmails = ["google", "gmail", "googlemail", "cloudfare"];
  let yahooEmails = ["yahoo", "yahoodns"];

  if (microsoftEmails.includes(provider)) {
    console.log(
      "Found MIcrosoft emails, so, asserting new providers:" + provider
    );
    return "microsoft";
  }

  if (googlEmails.includes(provider)) {
    console.log("Found Google emails, so, asserting new providers:" + provider);
    return "gmail";
  }

  if (yahooEmails.includes(provider)) {
    console.log("Found Google emails, so, asserting new providers:" + provider);
    return "yahoo";
  }

  return provider;
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
var server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
server.setTimeout(500000);
