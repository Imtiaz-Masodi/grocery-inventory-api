const { getMongooseInstance } = require("../database/mongoose");
const GroceryItem = require("./GroceryItem");
const mongoose = getMongooseInstance();

const inventoryHistorySchemaObj = {
    groceryItem: {
        type: mongoose.Types.ObjectId,
        ref: GroceryItem,
    },
    quantityModified: {
        type: Number,
        default: 0,
    },
    quantityThen: {
        type: Number,
        default: 0,
    },
    // modificationType: {
    //     type: String,
    //     enum: ["ADDED", "REMOVED"],
    //     default: "REMOVED",
    // },
    date: {
        type: Date,
        default: new Date(),
    },
};

const inventoryHistorySchema = mongoose.Schema(inventoryHistorySchemaObj);

const InventoryHistory = new mongoose.model('InventoryHistory', inventoryHistorySchema);

module.exports = InventoryHistory;
