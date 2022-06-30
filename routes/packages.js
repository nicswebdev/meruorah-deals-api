const Packages = require("../models/Packages");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newPackages = new Packages(req.body);
  try {
    const savedPackages = await newPackages.save();

    res.status(200).json(savedPackages);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedPackages = await Packages.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedPackages);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Packages.findByIdAndDelete(req.params.id);

    res.status(200).json("Packages has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// //Get Packages
router.get("/find/:id", async (req, res) => {
  try {
    const packages = await Packages.findById(req.params.id);

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //Get All Packages
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qDeal = req.query.deal;

  try {
    let packages;

    if (qNew) {
      packages = await Packages.find().sort({ createdAt: -1 }).limit(5);
    } else if (qDeal) {
      packages = await Packages.find({
        dealId: qDeal,
      });
    } else {
      packages = await Packages.find();
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
