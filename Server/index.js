const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const PdfManager = require("./Classes/pdfGenerator");
const LogManager = require("./Classes/logManager");
const WebsocketManager = require("./Classes/websocketManager");
const EventManger = require("./Classes/eventManager");
const DbManager = require("./Classes/MongoDb");

const pdfManager = new PdfManager();
const logManager = LogManager.getInstance();
const websocketManager = new WebsocketManager();
const eventManager = EventManger.getInstance();
const dbManager = DbManager.getInstance();

const path = require("path");
// const __dirname = path.resolve();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../printers-front - Copy/build")));
app.get("/pdf", express.static(path.join(__dirname + "/pdf")));

//CORS middleware
var corsMiddleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    next();
}

app.use(corsMiddleware);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../printers-front - Copy/build/index.html'));
});

app.get('/api', (req, res) => {
    res.setHeader("Content-disposition", "attachment; filename=" + req.query.filename);
    res.setHeader("Content-type", "application/pdf");
    var filestream = fs.createReadStream(req.query.filename);
    filestream.pipe(res);
})

app.post('/api', (req, res) => {
    dbManager.dbFindUserByWebsite(req.body.website)
        .then(user => {
            if (user.apiKey != req.body.apiKey) {
                res.status(400).send({succes: false, error: {message: "Wrong Api Key"}});
                return;
            }
            switch(req.body.type) {
                case ("order"):
                    logManager.log(`Received order #${req.body.orderData.orderID} from ${req.body.website}`)
                    if (logManager.isUnset(req.body.orderData.orderID, req.body.website)) {
                        console.log("Is unsent");
                    } else {
                        console.log("Is not unsent");
                    }
                    logManager.logPdf(req.body);
                    pdfManager.initPdf(req.body);
                    var eventName = req.body.website;
                    logManager.log(`Emitting event ${eventName}`);
                    eventManager.eventEmitter.emit(req.body.website, `${req.body.website}_${req.body.orderData.orderID}.pdf`);
                    res.sendStatus(200);
                    break;
                case ("html"):
                    pdfManager.htmlToPdf(req.body, () => {
                        if (typeof req.body.data.filename == "undefined") {
                            res.status(404).send({success: false, error: {message: "Please provide pdf filename"}});
                            return;
                        }
                        if (typeof req.body.website == "undefined") {
                            res.status(404).send({success: false, error: {message: "Please provide the website the pdf is belong to"}});
                            return;
                        }
                        logManager.log(`Recieved file ${req.body.data.filename}.pdf from ${req.body.webiste}`);
                        dbManager.dbInsertPdf({filename: `${req.body.data.filename}.pdf`, website: req.body.website})
                        .then(insertStatus => {
                            if (insertStatus) {
                                    logManager.logPdf(req.body);
                                    var eventName = req.body.website;
                                    logManager.log(`Emitting event ${eventName}`);
                                    eventManager.eventEmitter.emit(req.body.website, `${req.body.data.filename}.pdf`);
                                    res.sendStatus(200);
                                } else {
                                    logManager.log(`File ${req.body.data.filename}.pdf already exists in ${req.body.website}`);
                                    res.status(400).send({success: false, error: {message: "There is already a pdf file with this name"}});
                                }
                            })
                            .catch(err => {
                                res.status(400).send({success: false, error: {message: err}});
                            })
                        // res.sendStatus(200);
                    });
                    break;
                default:
                    res.status(404).send({success: false, error: {message: "Please specify the request's type (`data` or `html`)."}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
});

// Register user
app.post('/api/users/register', (req, res) => {
    validateCredentials(req, res, true);

    dbManager.dbRegisterUser(req.body)
        .then(registerStatus => {
            if (registerStatus) {
                res.sendStatus(200);
            } else {
                res.status(404).send({success: false, error: {message: "This email or website already exists"}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
});

// Login user
app.post('/api/users/login', (req, res) => {
    validateCredentials(req, res);
    dbManager.dbLogin(req.body)
        .then(user => {
            if (user) {
                res.status(200).send({success: true, user: user});
            } else {
                res.status(404).send({success: false, error: {message: "Could not find user with these details"}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
});

// Get user details
app.post('/api/users/:website', (req, res) => {
    if (typeof req.params.website === "undefined") {
        res.status(400).send({success: false, error: {message: "Please provide website"}})
        return;
    }
    dbManager.dbFindUserByWebsite(req.params.website)
        .then(user => {
            if (user) {
                res.status(200).send({success: true, message:{user: user}});
                return;
            } else {
                res.status(404).send({success: false, error: {message: "Could not find a user for this website"}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
});

app.post("/api/pdfs/print", (req, res) => {
    if (typeof req.body.filename == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide pdf filename"}});
        return;
    }
    if (typeof req.body.website == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide the website the pdf is belong to"}});
        return;
    }
    dbManager.dbLogPdfPrint(req.body);
    res.sendStatus(200);
})

// Get all pdfs of a website
app.get("/api/pdfs/:website", (req, res) => {
    dbManager.dbfindPdfsByWebsite(req.params.website)
        .then(pdfs => {
            if (pdfs) {
                // console.log(pdfs);
                res.status(200).send({success: true, pdfs: pdfs});
                return;
            } else {
                res.status(404).send({success: false, error: {message: "Could not find any pdfs for this website"}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
    // if (typeof req.params.website != "undefined") {
    //     const folder = `./pdf/${req.params.website}`;
    //     var files = [];
    //     if (!fs.existsSync(`pdf/${req.params.website}`)) {
    //         res.status(401).send({"message": "No pdf files found (website not exists in system)"});
    //         return;
    //     }
    //     fs.readdirSync(folder).forEach(file => {
    //         files.push(file);
    //     })
    //     res.status(200).send({"message": JSON.stringify(files)});
    // } else {
    //     res.status(401).send({"message": "Please provide a website"});
    // }
});

function validateCredentials(req, res, shouldCheckWebsite=false) {
    if (typeof req.body.email == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide email"}});
        return;
    }
    if (typeof req.body.password == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide password"}});
        return;
    }
    if (shouldCheckWebsite) {
        if (typeof req.body.website == "undefined") {
            res.status(404).send({success: false, error: {message: "Please provide website"}});
            return;
        }
    }
}

app.listen(80, () => {
    console.log("Listening on port 80");
});