const GroceryItem = require("../models/GroceryItem");
const ApiResponse = require("../pojo/ApiResponse");

function validateGroceryItemId(getItemId) {
    return async function(req, res, next) {
        const itemId = getItemId && getItemId(req);
        if (!itemId)
            return res.status(400).send(new ApiResponse(false, "Invalid request body. Please send grocery item id!"));

        const groceryItem = await GroceryItem.getById(itemId);
        if (!groceryItem)
            return res.status(400).send(new ApiResponse(false, "Invalid grocery item!"));

        req.stash = {};
        req.stash.groceryItem = groceryItem;
        next();
    }
}

module.exports = {
    validateGroceryItemId,
}