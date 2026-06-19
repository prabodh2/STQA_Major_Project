const { Router } = require("express");
const { CarModel } = require("../model/cars.model");
const { authmiddleware, dealerAuth } = require("../middlewares/auth.middleware");

const carRouter = Router();

// Public endpoint - Get all cars with filters
carRouter.get("/public/cars", async (req, res) => {
  const { color, price, mileage } = req.query;
  try {
    let query = {};
    let sortOptions = {};

    // Handle color filter
    if (color) {
      query["oemSpecs.colors"] = { $in: [color] };
    }

    // Handle price sorting
    if (price === "asc") {
      sortOptions.price = 1;
    } else if (price === "desc") {
      sortOptions.price = -1;
    }

    // Handle mileage sorting
    if (mileage === "asc") {
      sortOptions["oemSpecs.mileage"] = 1;
    } else if (mileage === "desc") {
      sortOptions["oemSpecs.mileage"] = -1;
    }

    console.log("Query:", JSON.stringify(query));
    console.log("Sort Options:", JSON.stringify(sortOptions));

    const cars = await CarModel.find(query)
      .sort(sortOptions)
      .populate('dealer', 'name email')
      .exec();

    console.log("Found cars:", cars.length);
    res.status(200).json({ status: "success", data: cars });
  } catch (error) {
    console.error("Error in public/cars endpoint:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get single car by ID
carRouter.get("/single-car/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car = await CarModel.findById(id)
      .populate('dealer', 'name email')
      .exec();
    
    if (!car) {
      return res.status(404).json({ status: "error", message: "Car not found" });
    }

    res.status(200).json({ status: "success", data: [car] });
  } catch (error) {
    console.error("Error in single-car endpoint:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get dealer's cars
carRouter.get("/dealer-cars", dealerAuth, async (req, res) => {
  try {
    const cars = await CarModel.find({ dealer: req.user.userId });
    res.status(200).json({ status: "success", data: cars });
  } catch (error) {
    console.error("Error in dealer-cars endpoint:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Add new car
carRouter.post("/add-car", dealerAuth, async (req, res) => {
  try {
    const carData = {
      ...req.body,
      dealer: req.user.userId
    };

    const car = new CarModel(carData);
    await car.save();

    res.status(201).json({ 
      status: "success", 
      message: "Car added successfully",
      data: car 
    });
  } catch (error) {
    console.error("Error in add-car endpoint:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

// Edit car
carRouter.patch("/edit-car/:id", dealerAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const car = await CarModel.findOneAndUpdate(
      { _id: id, dealer: req.user.userId },
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ 
        status: "error", 
        message: "Car not found or you don't have permission to edit it" 
      });
    }

    res.status(200).json({ 
      status: "success", 
      message: "Car updated successfully",
      data: car 
    });
  } catch (error) {
    console.error("Error in edit-car endpoint:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

// Delete car
carRouter.delete("/delete-car/:id", dealerAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const car = await CarModel.findOneAndDelete({ 
      _id: id, 
      dealer: req.user.userId 
    });

    if (!car) {
      return res.status(404).json({ 
        status: "error", 
        message: "Car not found or you don't have permission to delete it" 
      });
    }

    res.status(200).json({ 
      status: "success", 
      message: "Car deleted successfully" 
    });
  } catch (error) {
    console.error("Error in delete-car endpoint:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

module.exports = {
  carRouter
};
