const express = require("express");
const Category = require("../models/Category");
const ApiResponse = require("../pojo/ApiResponse");
const { handleCommonError } = require("../utilities/utils");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        return res.send(
            new ApiResponse(true, "Caterogy list fetched", categories)
        );
    } catch (ex) {
        handleCommonError(res, ex);
    }
});

router.post("/", async (req, res) => {
    try {
        let categoryItem = new Category({
            name: req.body.name,
            description: req.body.description,
            date: new Date(),
        });

        const { errors } = await categoryItem.validateSync() || {};
        if (errors) {
            return res.send(
                new ApiResponse(false, errors[Object.keys(errors)[0]].message)
            );
        }

        const categoryExists = await Category.isCategoryExists(categoryItem.name);
        if (categoryExists)
            return res
                .status(400)
                .send(new ApiResponse(false, `Category item with name '${categoryItem.name}' already exists!`));

        categoryItem = await categoryItem.save();
        res.send(
            new ApiResponse(
                true,
                "Category item created successfully!",
                categoryItem
            )
        );
    } catch (ex) {
        handleCommonError(res, ex);
    }
});

module.exports = router;
