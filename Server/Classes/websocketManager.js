const fs = require("fs");
const WebSocket = require("ws");
const EventManger = require("./eventManager");
const LogManager = require("./logManager");
const DbManager = require("./MongoDb");

const wss = new WebSocket.Server({ port: 8080 });
const eventManager = EventManger.getInstance();
const logManager = LogManager.getInstance();
const dbManager = DbManager.getInstance();

class WebsocketManager {
    constructor() {
        wss.on("connection", ws => {
            ws.on("message", message => {
                console.log("New connection");
                var m = JSON.parse(message);
                switch (m.type) {
                    case ("config"):
                        if (!fs.existsSync(`pdf/${m.data.brand}`)) {
                            fs.mkdirSync(`pdf/${m.data.brand}`);
                        }
                        eventManager.eventEmitter.on(m.data.brand, (pdfFilename) => {
                            logManager.log(`New connection received from ${m.data.brand}`);
                            ws.send(pdfFilename);
                        });
                        var unsentJobs = logManager.getAllOrdersBybrand(m.data.brand);
                        if (typeof unsentJobs != "undefined") {
                            unsentJobs.forEach(unsentJob => {
                                ws.send(`${unsentJob}.pdf`);
                            });
                        }
                        break;
                    case ("ps"):
                        logManager.removeFromQueue(m.data.brand, m.data.filename);
                        logManager.log(`${m.data.filename} from ${m.data.brand} has been successfuly printed`);
                        dbManager.dbLogPdfPrint({filename: m.data.brand, brand: m.data.brand});
                        console.log(m.data);
                        break;
                    case ("pe"):
                        logManager.log(`An error occured while trying to print ${m.data.filename} from ${m.data.brand}`)
                        console.log(m.data);
                        break;
                    case ("dfs"):
                        logManager.log(`${m.data.filename} from ${m.data.brand} has been successfuly deleted`);
                        console.log(m.data);
                        break;
                    case ("dff"):
                        logManager.log(`An error occured while trying to delete ${m.data.filename} from ${m.data.brand}`)
                        console.log(m.data);
                        break;
                }
            })
            ws.on("close", message => {
                console.log("Close - " + message);
            })
        })
    }

}

module.exports = WebsocketManager;