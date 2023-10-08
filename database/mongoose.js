const mongoose = require('mongoose');
const { ATLAS_URI } = require('../utilities/constants');

const uri = ATLAS_URI;
const connectOptions = {
    dbName: "grocery",
    user: "admin",
    pass: "Otz4YKNqPyJzHYe9"
};

const connect = async () => {
    try {
        if (mongoose.ConnectionStates.connected !== mongoose.connection.readyState) {
            await mongoose.connect(uri, connectOptions);
            console.log("Connected to mongodb successfully!");
        }
        return mongoose;
    } catch (err) {
        throw err;
    }
}

const disconnect = async () => {
    try {
        if (mongoose.connection.readyState !== mongoose.ConnectionStates.disconnected) {
            await mongoose.disconnect();
        }
    } catch(err) {
        throw err;
    }
}

const getInstance = () => {
    return mongoose;
}

module.exports = {
    connect,
    disconnect,
    getMongooseInstance: getInstance
}