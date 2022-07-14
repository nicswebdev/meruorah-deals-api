const Deals = require("../models/Deals");
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newDeals = new Deals(req.body);
    try {
        const savedDeals = await newDeals.save();

        res.status(200).json(savedDeals);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedDeals = await Deals.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedDeals);
    } catch (error) {
        res.status(500).json(error);
    }
});

// //Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Deals.findByIdAndDelete(req.params.id);

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json(error);
    }
});

// //Get Deals
router.get("/find/:id", async (req, res) => {
    try {
        const deal = await Deals.findById(req.params.id);

        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json(error);
    }
});

// //Get All Deals
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let deals;

        if (qNew) {
            deals = await Deals.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            deals = await Deals.find({
                categories: {
                    $elemMatch: {
                        categoryId: [qCategory],
                    },
                },
            });
        } else {
            deals = await Deals.find();
        }

        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get highlight deals
router.get("/highlight", async (req, res) => {
    try {
        const deals = await Deals.aggregate([
            {
                $sample: { size: 1 },
            },
        ]);

        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get featured deals
router.get("/featured", async (req, res) => {
    try {
        const deals = await Deals.aggregate([
            {
                $sample: { size: 3 },
            },
        ]);

        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
