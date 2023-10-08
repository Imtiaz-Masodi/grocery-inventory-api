const express = require('express');
const ApiResponse = require('../pojo/ApiResponse');
const InventoryHistory = require("../models/InventoryHistory");
const { handleCommonError } = require('../utilities/utils');
const router = new express.Router();

router.get("/", async (req, res) => {
    try {
        const inventoryHistory = await InventoryHistory.find().sort({date: 'desc'}).populate("groceryItem");
        res.send(new ApiResponse(true, "Inventory history list!", inventoryHistory));
    } catch(ex) {
        handleCommonError(req, ex);
    }
});

module.exports = router;
