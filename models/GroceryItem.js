const { getMongooseInstance } = require("../database/mongoose");
const mongoose = getMongooseInstance();

const groceryItemSchemaObj = {
    name: {
        type: String,
        required: [true, "Grocery item name is required!"],
        minLength: [3, "Invalid Grocery name. It should be atleast 3 characters long"],
        maxLength: [75, "Invalid Grocery name. It should be atmost 75 characters long"],
    },
    description: {
        type: String,
        maxLength: [255, "Invalid grocery item description. It should be atmost 255 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Grocery item price is required!"],
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    stockCount: {
        type: Number,
        min: 0,
        default: 0,
    },
    imgUrl: String,
    createdOn: Date,
    updatedOn: {
        type: Date,
        default: new Date(),
    },
    isActive: {
        type: Boolean,
        default: true
    }
};

const groceryItemSchema = mongoose.Schema(groceryItemSchemaObj);

groceryItemSchema.statics.getById = async function(id) {
    return await this.findOne({ _id: id });
}

groceryItemSchema.statics.isGroceryItemExists = async function(name) {
    name = name.trim();
    const groceryItem = await this.findOne({ name });
    return Boolean(groceryItem?._id);
}

const GroceryItem = mongoose.model("GroceryItem", groceryItemSchema);

module.exports = GroceryItem;
