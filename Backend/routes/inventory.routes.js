const { Router } = require("express");
const { InventoryModel } = require("../model/inventory.model");
const { authmiddleware, dealerAuth } = require("../middlewares/auth.middleware");

const inventoryRouter = Router();

// Add sample data - FOR TESTING ONLY
inventoryRouter.post("/add-sample-data", async (req, res) => {
  try {
    const sampleCars = [
      {
        title: "2022 BMW 3 Series",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070&h=1380",
        description: "Luxury sedan with premium features and excellent performance",
        price: 4500000,
        oemSpecs: {
          colors: ["Black", "White", "Silver"],
          mileage: 15,
          model: "3 Series",
          brand: "BMW"
        },
        kmOnOdometer: 5000,
        majorScratches: "None",
        originalPaint: "Yes",
        accidentsReported: 0,
        previousBuyers: 0,
        registrationPlace: "Mumbai"
      },
      {
        title: "2021 Mercedes-Benz C-Class",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070&h=1380",
        description: "Elegant luxury car with advanced technology",
        price: 5200000,
        oemSpecs: {
          colors: ["White", "Black", "Blue"],
          mileage: 14,
          model: "C-Class",
          brand: "Mercedes-Benz"
        },
        kmOnOdometer: 8000,
        majorScratches: "None",
        originalPaint: "Yes",
        accidentsReported: 0,
        previousBuyers: 1,
        registrationPlace: "Delhi"
      },
      {
        title: "2023 Audi A4",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=2070&h=1380",
        description: "Modern luxury sedan with quattro all-wheel drive",
        price: 4800000,
        oemSpecs: {
          colors: ["Red", "Black", "Grey"],
          mileage: 16,
          model: "A4",
          brand: "Audi"
        },
        kmOnOdometer: 3000,
        majorScratches: "None",
        originalPaint: "Yes",
        accidentsReported: 0,
        previousBuyers: 0,
        registrationPlace: "Bangalore"
      }
    ];

    // Clear existing data
    await InventoryModel.deleteMany({});
    
    // Add sample data
    const cars = await InventoryModel.insertMany(sampleCars);
    
    res.status(201).json({
      status: "success",
      message: "Sample data added successfully",
      data: cars
    });
  } catch (error) {
    console.error("Error adding sample data:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// Public endpoint - Get all cars with filters
inventoryRouter.get("/public/cars", async (req, res) => {
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

    const cars = await InventoryModel.find(query)
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
inventoryRouter.get("/single-car/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car = await InventoryModel.findById(id)
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

// Protected routes below this point
inventoryRouter.use(authmiddleware);

// Get all cars
inventoryRouter.get("/cars", async (req, res) => {
  const { color, price, mileage } = req.query;
  try {
    let query = {};
    let sortOptions = {};

    if (color) {
      query.color = color;
    }

    if (price === "asc") {
      sortOptions.price = 1;
    } else if (price === "desc") {
      sortOptions.price = -1;
    }

    if (mileage === "asc") {
      sortOptions["oemSpecs.mileage"] = 1;
    } else if (mileage === "desc") {
      sortOptions["oemSpecs.mileage"] = -1;
    }

    const cars = await InventoryModel.find(query).sort(sortOptions).exec();
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all cars
inventoryRouter.get("/get-cars", async (req, res) => {
  try {
    const cars = await InventoryModel.find().populate('dealer', 'name email');
    res.status(200).json(cars);
  } catch (err) {
    console.error("Error getting cars:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get dealer's cars - dealer only
inventoryRouter.get("/my-cars", dealerAuth, async (req, res) => {
  try {
    const cars = await InventoryModel.find({ dealer: req.user.userId });
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add car - dealer only
inventoryRouter.post("/add-car", dealerAuth, async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2));
    console.log("User data:", req.user);

    // Basic validation for required fields
    const requiredFields = [
      'title', 'description', 'image', 'kmOnOdometer',
      'majorScratches', 'originalPaint', 'accidentsReported',
      'previousBuyers', 'registrationPlace', 'price'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '' || 
             (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return res.status(400).json({
        error: "Missing required fields",
        details: missingFields
      });
    }

    // Validate numeric fields
    const numericFields = {
      kmOnOdometer: "Kilometers on Odometer",
      accidentsReported: "Accidents Reported",
      previousBuyers: "Previous Buyers",
      price: "Price"
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = Number(req.body[field]);
      if (isNaN(value)) {
        console.log(`Invalid numeric value for ${field}:`, req.body[field]);
        return res.status(400).json({
          error: "Invalid numeric value",
          details: `${label} must be a valid number`
        });
      }
      if (value < 0) {
        console.log(`Negative value for ${field}:`, value);
        return res.status(400).json({
          error: "Invalid numeric value",
          details: `${label} cannot be negative`
        });
      }
    }

    // Create car data
    const carData = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      image: req.body.image.trim(),
      kmOnOdometer: Number(req.body.kmOnOdometer),
      majorScratches: req.body.majorScratches.trim(),
      originalPaint: req.body.originalPaint.trim(),
      accidentsReported: Number(req.body.accidentsReported),
      previousBuyers: Number(req.body.previousBuyers),
      registrationPlace: req.body.registrationPlace.trim(),
      price: Number(req.body.price),
      dealer: req.user.userId
    };

    // Add oemSpecs if it exists
    if (req.body.oemSpecs) {
      const cleanOemSpecs = Object.entries(req.body.oemSpecs)
        .reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'colors' && Array.isArray(value)) {
              acc[key] = value.filter(Boolean);
            } else if (key === 'year') {
              acc[key] = Number(value);
            } else {
              acc[key] = String(value).trim();
            }
          }
          return acc;
        }, {});

      if (Object.keys(cleanOemSpecs).length > 0) {
        carData.oemSpecs = cleanOemSpecs;
      }
    }

    console.log("Processed car data:", JSON.stringify(carData, null, 2));

    const newInventory = new InventoryModel(carData);
    
    // Validate the document
    const validationError = newInventory.validateSync();
    if (validationError) {
      console.error("Mongoose validation error:", validationError);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: Object.values(validationError.errors).map(err => err.message)
      });
    }

    // Save the document
    const savedInventory = await newInventory.save();
    console.log("Successfully saved inventory:", savedInventory._id);

    res.status(200).json({ 
      message: "Car added successfully", 
      car: savedInventory 
    });
  } catch (error) {
    console.error("Error in add-car route:", error);
    res.status(400).json({ 
      error: error.message,
      details: error.errors ? Object.values(error.errors).map(err => err.message) : [error.message]
    });
  }
});

// Edit car - dealer only, and only their own cars
inventoryRouter.patch("/edit-car/:id", dealerAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const car = await InventoryModel.findOne({ _id: id, dealer: req.user.userId });
    if (!car) {
      return res.status(404).json({ message: "Car not found or you don't have permission to edit" });
    }

    const updatedCar = await InventoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete car - dealer only, and only their own cars
inventoryRouter.delete("/delete-car/:id", dealerAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const car = await InventoryModel.findOne({ _id: id, dealer: req.user.userId });
    if (!car) {
      return res.status(404).json({ message: "Car not found or you don't have permission to delete" });
    }

    await InventoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { inventoryRouter };
