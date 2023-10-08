const express = require("express");
const GroceryItem = require("../models/GroceryItem");
const ApiResponse = require("../pojo/ApiResponse");
const { handleCommonError } = require("../utilities/utils");
const { validateGroceryItemId } = require("../middlewares/groceryMiddleware");
const InventoryHistory = require("../models/InventoryHistory");

const router = new express.Router();

router.get("/list", async (req, res) => {
    try {
        const groceryItems = await GroceryItem.find().sort({createdOn: 'desc'}).populate('category');
        res.send(new ApiResponse(true, 'Grocery item fectched successfully!', groceryItems));
    } catch (ex) {
        handleCommonError(res, ex);
    }
});

router.post("/add", async (req, res) => {
    try {
        let groceryItem = new GroceryItem({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stockCount: req.body.stockCount,
            imgUrl: '',
            createdOn: new Date(),
            isActive: true,
        });
        
        const {errors} = await groceryItem.validateSync() || {};
        if (errors) {
            return res.send(new ApiResponse(false, errors[Object.keys(errors)[0]].message));
        }

        const groceryItemExists = await GroceryItem.isGroceryItemExists(groceryItem.name);
        if (groceryItemExists)
            return res.status(400).send(new ApiResponse(false, `'${groceryItem.name}' item already exists!`));

        groceryItem = await groceryItem.save();
        res.send(new ApiResponse(true, 'Grocery item added successfully!', groceryItem));

        //ToDo: Add item in inventory history collection
        updateInventory(groceryItem._id, groceryItem.stockCount, 0);
    } catch(ex) {
        handleCommonError(res, ex);
    }
});

router.put("/update", validateGroceryItemId(req => req.body.id), async (req, res) => {
    try {
        const groceryItem = req.stash.groceryItem;
        if (groceryItem.name !== req.body.name) {
            const itemNameAlreadyInUse = await GroceryItem.isGroceryItemExists(req.body.name);
            if (itemNameAlreadyInUse)
                return res.status(400).send(new ApiResponse(false, `'${groceryItem.name}' item already exists. Please try using a different name!`));
        }

        delete req.body.stockCount;
        const upatedItem = await GroceryItem.findByIdAndUpdate(req.body.id, req.body, { new: true, runValidators: true });
        res.send(new ApiResponse(true, 'Grocery item updated successfully!', upatedItem));
    } catch(ex) {
        handleCommonError(res, ex);
    }
});

router.post("/update-inventory", validateGroceryItemId(req => req.body.id), async (req, res) => {
    try {
        const groceryItem = req.stash.groceryItem;
        const { id, itemCount } = req.body;
        if (itemCount === undefined)
            return res.status(400).send(new ApiResponse(false, "itemCount parameter is required!"));

        if (groceryItem.stockCount + itemCount < 0)
            return res.status(400).send(new ApiResponse(false, "ItemCount cannot be less than stock count"));

        const oldStockCount = groceryItem.stockCount;
        groceryItem.stockCount += itemCount;
        const updatedItem = await groceryItem.save();
        res.send(new ApiResponse(true, 'Grocery stock updated successfully!', updatedItem));
        updateInventory(id, itemCount, oldStockCount);
    } catch(ex) {
        handleCommonError(res, ex);
    }
});

function updateInventory(id, quantityModified, quantityThen) {
    const inventoryHistory = new InventoryHistory({
        groceryItem: id,
        quantityModified,
        quantityThen
    });

    inventoryHistory.save();
}

module.exports = router;
