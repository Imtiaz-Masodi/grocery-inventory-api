const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./database/mongoose");
const ApiResponse = require("./pojo/ApiResponse");
const grocery = require("./routes/grocery");
const category = require("./routes/category");
const inventory = require("./routes/inventory");
const { handleCors } = require("./utilities/utils");

const app = express();
const port = 3300;

app.use(handleCors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/grocery", grocery);
app.use("/category", category);
app.use("/inventory", inventory);

app.get("/", (req, res) => {
    res.send("Grocery inventory mangement system server up and running...");
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(new ApiResponse(false, err.message));
});

app.listen(port, () => {
    mongoose.connect();
    console.log(
        `Grocery inventory managment api server started and listening on ${port} port`
    );
});
