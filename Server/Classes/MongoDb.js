const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

// MongoClient.connect(url, (err, db) => {
//     if (err) throw err;
//     var dbo = db.db("printdf");
//     console.log("Database created!");
//     db.close();
// });

class PrivateDbManager {

    constructor() {
        this.url = "mongodb://localhost:27017/";
        this.initConnection();
    }

    initConnection() {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, db) => {
            if (err) throw err;
            this.conn = db.db("printdf");
            console.log("Connected to db");
        });
    }

    dbFindOne(collectionName, args) {
        return new Promise((resolve, reject) => {
            this.conn.collection(collectionName).findOne(args, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        })
    }

    dbFindMany(collectionName, args, projection) {
        return new Promise((resolve, reject) => {
            this.conn.collection(collectionName).find(args, {projection: projection}).toArray((err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    dbInsertOne(collectionName, args) {
        this.conn.collection(collectionName).insertOne(args, (err, res) => {
            if (err) throw err;
            console.log("1 document inserted");
        });
    }

    dbUpdateOne(collection, searchArgs, updateArgs) {
        var filter = this.buildFilter(searchArgs);
        var update = {
            $set: {}
        }
        for (const [key, value] of Object.entries(updateArgs)) {
            var obj = {};
            update.$set[key] = value;
            // update.$set.push(obj);
        }
        this.conn.collection(collection).updateOne(filter, update);
    }

    dbFindUser(args) {
        return new Promise((resolve, reject) => {
            this.dbFindOne("users", args)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        });
    }

    dbFindPdf(args) {
        return new Promise((resolve, reject) => {
            this.dbFindOne("pdfs", args)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    dbfindPdfsByWebsite(website) {
        return new Promise((resolve, reject) => {
            this.dbFindMany("pdfs", {website: website}, {_id: 0, filename: 1, createdTime: 1, printTime: 1})
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        });
    }

    dbFindUserByWebsite(website) {
        return new Promise((resolve, reject) => {
            this.dbFindUser(this.buildFilter({website: website}))
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    dbRegisterUser(args) {
        return new Promise((resolve, reject) => {
            this.dbFindUser(this.buildFilter({email: args.email, website: args.website}, "or"))
                .then(res => {
                    if (!res) {
                        this.dbInsertOne("users", args);
                        resolve(1);
                    } else {
                        resolve(0)
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    dbLogin(args) {
        return new Promise((resolve, reject) => {
            this.dbFindUser(args)
                .then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    // dbFindPdfs(args) {
    //     return new Promise((resolve, reject) => {

    //     });
    // }

    dbInsertPdf(args) {
        return new Promise((resolve, reject) => {
            this.dbFindPdf(this.buildFilter(args))
                .then(res => {
                    if (!res) {
                        args.createdTime = new Date;
                        this.dbInsertOne("pdfs", args);
                        resolve(1);
                    } else {
                        resolve(0);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    dbLogPdfPrint(searchArgs) {
        var updateArgs = {printTime: new Date};
        this.dbUpdateOne("pdfs", searchArgs, updateArgs);
    }

    buildFilter(args, queryType="and") {
        var type = `$${queryType}`;
        var filter = {};
        filter[type] = [];
        for (const [key, value] of Object.entries(args)) {
            var obj = {};
            obj[key] = value;
            filter[type].push(obj);
        }
        return filter;
    }

    // dbCloseConnection() {
    //     this.conn.close();
    // }

}

class dbManager {
    static getInstance() {
        if (!dbManager.instance) {
            dbManager.instance = new PrivateDbManager();
        }
        return dbManager.instance;
    }
}

module.exports = dbManager;