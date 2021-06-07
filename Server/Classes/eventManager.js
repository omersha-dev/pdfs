const EventEmitter = require("events");

class PrivateEventManager {
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    registerConnection(userID, pcID) {
        this.connections.push({
            "userID": userID,
            "pcID": pcID
        });
    }

    getRegisteredConnections() {
        return this.connections;
    }
}

class EventManager {
    constructor() {
        this.connections = [];
    }

    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new PrivateEventManager();
        }
        return EventManager.instance;
    }

}

module.exports = EventManager;