const Vendor = require("../models/Vendor");
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newVendor = new Vendor(req.body);
    try {
        const savedVendor = await newVendor.save();

        res.status(200).json(savedVendor);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedVendor);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get Vendor
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Vendor
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;

    try {
        const vendors = query
            ? await Vendor.find().sort({ _id: -1 }).limit(5)
            : await Vendor.find();

        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
