const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const schemaData = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
}, {
    timestamps: true
});

const userModel = mongoose.model("user", schemaData);

// Read
app.get("/", async (req, res) => {
    const data = await userModel.find({});
    res.json({ success: true, data: data });
});

// Create data in MongoDB
app.post("/create", async (req, res) => {
    console.log(req.body);
    const data = new userModel(req.body);
    await data.save();
    res.send({ success: true, message: "Data saved successfully", data: data });
});

// Update data
app.put("/update", async (req, res) => {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    console.log(rest);
    const data = await userModel.updateOne({ _id: _id }, rest);
    res.send({ success: true, message: "Data updated successfully", data: data });
});

// Delete API
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await userModel.deleteOne({ _id: id });
    res.send({ success: true, message: "Data deleted successfully", data: data });
});

mongoose.connect("mongodb://localhost:27017/EnterpriseSystem")
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log("Server is running"));
    })
    .catch((err) => console.log(err));

    app.post("/create", async (req, res) => {
        const { _id, ...rest } = req.body; 
        if (_id) {
            rest._id = _id; 
        }
        const data = new userModel(rest); 
        try {
            await data.save();
            res.send({ success: true, message: "Data saved successfully", data: data });
        } catch (err) {
            res.status(400).send({ success: false, message: "Failed to save data", error: err.message });
        }
    });
