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
const { response } = require("express");
// const __dirname = path.resolve();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../printers-front - Copy/build")));
app.use(express.static(path.join(__dirname, "pdf/*")));
app.use('/pdf', (req, res) => {
    var test = req.path.replace(/\/\s*$/, "");
    fs.readFile(path.join(__dirname, `pdf${test}`), (err, data) => {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.use(express.static('public/pdf'))

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
    dbManager.dbFindUserByBrand(req.body.brand)
        .then(user => {
            if (user.apiKey != req.body.apiKey) {
                res.status(400).send({success: false, error: {message: "Wrong Api Key"}});
                return;
            }
            switch(req.body.type) {
                case ("order"):
                    logManager.log(`Received order #${req.body.orderData.orderID} from ${req.body.brand}`)
                    if (logManager.isUnset(req.body.orderData.orderID, req.body.brand)) {
                        console.log("Is unsent");
                    } else {
                        console.log("Is not unsent");
                    }
                    logManager.logPdf(req.body);
                    pdfManager.initPdf(req.body);
                    var eventName = req.body.brand;
                    logManager.log(`Emitting event ${eventName}`);
                    eventManager.eventEmitter.emit(req.body.brand, `${req.body.brand}_${req.body.orderData.orderID}.pdf`);
                    res.sendStatus(200);
                    break;
                case ("html"):
                    pdfManager.htmlToPdf(req.body, () => {
                        if (typeof req.body.data.filename == "undefined") {
                            res.status(404).send({success: false, error: {message: "Please provide pdf filename"}});
                            return;
                        }
                        if (typeof req.body.brand == "undefined") {
                            res.status(404).send({success: false, error: {message: "Please provide the brand the pdf is belong to"}});
                            return;
                        }
                        logManager.log(`Recieved file ${req.body.data.filename}.pdf from ${req.body.webiste}`);
                        dbManager.dbInsertPdf({filename: `${req.body.data.filename}.pdf`, brand: req.body.brand})
                        .then(insertStatus => {
                            if (insertStatus) {
                                    logManager.logPdf(req.body);
                                    var eventName = req.body.brand;
                                    logManager.log(`Emitting event ${eventName}`);
                                    eventManager.eventEmitter.emit(req.body.brand, `${req.body.data.filename}.pdf`);
                                    res.sendStatus(200);
                                } else {
                                    logManager.log(`File ${req.body.data.filename}.pdf already exists in ${req.body.brand}`);
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
                // console.log(req.body);
                if (!fs.existsSync(path.resolve(__dirname, `pdf/${req.body.brand}`))) {
                    fs.mkdirSync(path.resolve(__dirname, `pdf/${req.body.brand}`));
                    // console.log(`pdf/${req.body.brand} has been created`);
                }
                res.sendStatus(200);
            } else {
                res.status(404).send({success: false, error: {message: "This email or brand already exists"}});
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
app.post('/api/users/:brand', (req, res) => {
    if (typeof req.params.brand === "undefined") {
        res.status(400).send({success: false, error: {message: "Please provide brand"}})
        return;
    }
    dbManager.dbFindUserByBrand(req.params.brand)
        .then(user => {
            if (user) {
                res.status(200).send({success: true, message:{user: user}});
                return;
            } else {
                res.status(404).send({success: false, error: {message: "Could not find a user for this brand"}});
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
    if (typeof req.body.brand == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide the brand the pdf is belong to"}});
        return;
    }
    dbManager.dbLogPdfPrint(req.body);
    res.sendStatus(200);
})

app.post("/api/users", (req, res) => {
    if (typeof req.body.brand == "undefined" || typeof req.body.apiKey == "undefined") {
        res.status(404).send({success: false, error: {message: "Could not be identified"}});
        return;
    }
    dbManager.dbFindUserByArgs({
        brand: req.body.brand,
        apiKey: req.body.apiKey,
        privileges: "admin"
    })
        .then(
            dbManager.dbFindMany("users", {}, ["email", "apiKey", "brand", "privileges"])
                .then(users => {
                    if (users) {
                        // console.log(users);
                        res.status(200).send({success: true, users: users});
                        return;
                    } else {
                        res.status(404).send({success: false, error: {message: "Could not find any users"}});
                        return;
                    }
                })
                .catch(err => {
                    res.status(400).send({success: false, error: {message: err}});
                })
        )
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
})

// Get all pdfs of a brand
app.get("/api/pdfs/:brand", (req, res) => {
    dbManager.dbfindPdfsByBrand(req.params.brand)
        .then(pdfs => {
            if (pdfs) {
                res.status(200).send({success: true, pdfs: pdfs});
                return;
            } else {
                res.status(404).send({success: false, error: {message: "Could not find any pdfs for this brand"}});
            }
        })
        .catch(err => {
            res.status(400).send({success: false, error: {message: err}});
        })
});

function validateCredentials(req, res, shouldCheckBrand=false) {
    if (typeof req.body.email == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide email"}});
        return;
    }
    if (typeof req.body.password == "undefined") {
        res.status(404).send({success: false, error: {message: "Please provide password"}});
        return;
    }
    if (shouldCheckBrand) {
        if (typeof req.body.brand == "undefined") {
            res.status(404).send({success: false, error: {message: "Please provide brand"}});
            return;
        }
    }
}

app.listen(80, () => {
    console.log("Listening on port 80");
});