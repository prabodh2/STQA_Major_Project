require('dotenv').config();
const mongoose = require('mongoose');
const { InventoryModel } = require('../model/inventory.model');
const { OEM_SpecsModel } = require('../model/oem_specs.model');
const { UserModel } = require('../model/user.model');
const { cars } = require('./cars');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Clear existing data
        await InventoryModel.deleteMany({});
        await OEM_SpecsModel.deleteMany({});
        console.log('Cleared existing data');

        // Find the seeded dealer
        const dealer = await UserModel.findOne({ email: "sales@premiumauto.com" });
        if (!dealer) {
            throw new Error("Dealer sales@premiumauto.com not found. Run dealer.seed.js first!");
        }
        const dealerId = dealer._id;
        console.log('Found dealer with ID:', dealerId);

        // First create OEM specs
        for (const car of cars) {
            const oemSpec = new OEM_SpecsModel({
                model_name: car.oemSpecs.model,
                year: car.oemSpecs.year.toString(),
                new_model_price: car.oemSpecs.listPrice || car.price || 1000000,
                colors: car.oemSpecs.colors.join(','),
                mileage: parseFloat(car.oemSpecs.mileage) || 15,
                power: car.oemSpecs.power.toString(),
                maxspeed: parseInt(car.oemSpecs.maxSpeed) || 180
            });

            const savedOemSpec = await oemSpec.save();
            
            // Create inventory with reference to OEM spec
            const inventory = new InventoryModel({
                title: car.title,
                image: car.image,
                description: car.description,
                price: car.price,
                kmOnOdometer: car.kmOnOdometer,
                majorScratches: car.majorScratches,
                originalPaint: car.originalPaint,
                accidentsReported: car.accidentsReported,
                previousBuyers: car.previousBuyers,
                registrationPlace: car.registrationPlace,
                oemSpecs: {
                    colors: car.oemSpecs.colors,
                    mileage: parseFloat(car.oemSpecs.mileage) || 15,
                    model: car.oemSpecs.model,
                    brand: car.title.split(' ')[0]
                },
                dealer: dealerId
            });

            await inventory.save();
        }

        console.log('Seed data inserted successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
