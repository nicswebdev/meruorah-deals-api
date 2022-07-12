const Order = require("../models/Order");
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//Create
// router.post("/", verifyToken, async (req, res) => {
//   const newOrder = new Order(req.body);
//   try {
//     const savedOrder = await newOrder.save();

//     res.status(200).json(savedOrder);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.post("/", async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();

        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get User Orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.id,
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;

    try {
        let orders;

        if (qNew) {
            //orders = await Order.find().sort({ createdAt: -1 }).limit(5);
            orders = await Order.aggregate([
                { $set: { userId: { $toObjectId: "$userId" } } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user_data",
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $limit: 5,
                },
            ]);
        } else {
            orders = await Order.find();
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();

    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
        new Date().setMonth(lastMonth.getMonth() - 1)
    );

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
