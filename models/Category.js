const { getMongooseInstance } = require("../database/mongoose");
const mongoose = getMongooseInstance();

const categorySchemaObj = {
    name: {
        type: String,
        required: [true, 'Category name is required!'],
        minLength: [2, 'Invalid category name. It should be atleast 2 characters long!'],
        maxLength: [50, 'Invalid category name. It should be atmost 50 characters long! ']
    },
    description: {
        type: String,
        maxLength: [255, 'Invalid category description. It should be atmost 255 charcters long!']
    },
    createdOn: Date,
};

const categorySchema = mongoose.Schema(categorySchemaObj);

categorySchema.statics.isCategoryExists = async function(categoryName) {
    const categoryItem = await this.findOne({ name: categoryName.trim() });
    return Boolean(categoryItem?._id);
}

const Category = new mongoose.model('Category', categorySchema);

module.exports = Category;
