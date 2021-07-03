const fs = require("fs");
const path = require("path");

class PrivateLogManager {

    constructor() {
        this.filename = "pdfjobs.json";
        this.unsentPdfs = this.initOrdersLog();
    }

    // Gets all the orders from the JSON file once the program is started.
    // If it is empty, return an empty object.
    initOrdersLog() {
        var unsentPdfsJson = fs.readFileSync(path.resolve(__dirname, `../${this.filename}`));
        if (unsentPdfsJson.length > 0) {
            return JSON.parse(unsentPdfsJson);
        } else {
            return {};
        }
    }

    getAllOrdersByBrand(brand) {
        return this.unsentPdfs[brand];
    }

    // Logs the order.
    logPdf(dataFromBrand) {
        var filename;
        if (dataFromBrand.type == "order") {
            filename = dataFromBrand.orderData.orderID;
        } else if (dataFromBrand.type == "html") {
            filename = dataFromBrand.data.filename;
        }
        if (dataFromBrand.brand in this.unsentPdfs && !this.unsentPdfs[dataFromBrand.brand].includes(filename)) {
            this.unsentPdfs[dataFromBrand.brand].push(filename);
        } else {
            this.unsentPdfs[dataFromBrand.brand] = [filename];
        }
        fs.writeFileSync(this.filename, JSON.stringify(this.unsentPdfs));
        this.log(`${filename} has been added to pdfjobs.json`);
    }

    // Remove an order from the json file.
    removeFromQueue(brand, filename) {
        filename = filename.replace(".pdf", "");
        var index = this.unsentPdfs[brand].indexOf(filename);
        if (index >= 0) {
            this.unsentPdfs[brand].splice(index, 1);
            this.log(`${filename} has been removed from pdfjobs.json`);
        }
        fs.writeFileSync(this.filename, JSON.stringify(this.unsentPdfs));
    }

    // Log input text to file (default `logs.txt`)
    log(text, file="logs.txt") {
        var dateString = "[" + new Date + "]: ";
        fs.appendFileSync(file, dateString + text + "\n");
    }

    // Returns TRUE if the order is in unsent orders
    isUnset(orderID, brand) {
        return this.unsentPdfs[brand].includes(orderID) ? true : false;
    }

}

class LogManager {
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new PrivateLogManager();
        }
        return LogManager.instance;
    }
}

module.exports = LogManager;