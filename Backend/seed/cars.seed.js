const mongoose = require('mongoose');
const { CarModel } = require('../model/cars.model');
const { UserModel } = require('../model/user.model');
require('dotenv').config();
const DEALER_ID = null;

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
    registrationPlace: "Mumbai",
    dealer: DEALER_ID
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
    registrationPlace: "Delhi",
    dealer: DEALER_ID
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
    registrationPlace: "Bangalore",
    dealer: DEALER_ID
  },
  {
    title: "2023 Toyota Camry Hybrid",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Efficient hybrid sedan with premium comfort features",
    price: 3500000,
    oemSpecs: {
      colors: ["Pearl White", "Midnight Black", "Silver Metallic"],
      mileage: 23,
      model: "Camry",
      brand: "Toyota"
    },
    kmOnOdometer: 1000,
    majorScratches: "None",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 0,
    registrationPlace: "Chennai",
    dealer: DEALER_ID
  },
  {
    title: "2022 Honda City",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Reliable sedan with excellent fuel efficiency",
    price: 1500000,
    oemSpecs: {
      colors: ["Modern Steel Metallic", "Platinum White", "Radiant Red"],
      mileage: 21,
      model: "City",
      brand: "Honda"
    },
    kmOnOdometer: 12000,
    majorScratches: "Minor",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 1,
    registrationPlace: "Pune",
    dealer: DEALER_ID
  },
  {
    title: "2023 Hyundai Creta",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Popular SUV with advanced features and comfortable ride",
    price: 1800000,
    oemSpecs: {
      colors: ["Galaxy Blue", "Phantom Black", "Polar White"],
      mileage: 18,
      model: "Creta",
      brand: "Hyundai"
    },
    kmOnOdometer: 5000,
    majorScratches: "None",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 0,
    registrationPlace: "Hyderabad",
    dealer: DEALER_ID
  },
  {
    title: "2022 Tata Nexon EV",
    image: "https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Electric SUV with impressive range and features",
    price: 1600000,
    oemSpecs: {
      colors: ["Teal Blue", "Pristine White", "Starlight"],
      mileage: 0,
      model: "Nexon EV",
      brand: "Tata"
    },
    kmOnOdometer: 8000,
    majorScratches: "None",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 1,
    registrationPlace: "Kolkata",
    dealer: DEALER_ID
  },
  {
    title: "2023 Mahindra XUV700",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Premium SUV with advanced driver assistance systems",
    price: 2500000,
    oemSpecs: {
      colors: ["Electric Blue", "Midnight Black", "Everest White"],
      mileage: 15,
      model: "XUV700",
      brand: "Mahindra"
    },
    kmOnOdometer: 3000,
    majorScratches: "None",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 0,
    registrationPlace: "Bangalore",
    dealer: DEALER_ID
  },
  {
    title: "2022 Kia Seltos",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?auto=format&fit=crop&q=80&w=2070&h=1380",
    description: "Feature-rich compact SUV with premium interiors",
    price: 1700000,
    oemSpecs: {
      colors: ["Galaxy Pearl", "Aurora Black", "Glacier White"],
      mileage: 17,
      model: "Seltos",
      brand: "Kia"
    },
    kmOnOdometer: 15000,
    majorScratches: "Minor",
    originalPaint: "Yes",
    accidentsReported: 1,
    previousBuyers: 1,
    registrationPlace: "Delhi",
    dealer: DEALER_ID
  }
];

async function seedCars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Find the seeded dealer
    const dealer = await UserModel.findOne({ email: "sales@premiumauto.com" });
    if (!dealer) {
      throw new Error("Dealer sales@premiumauto.com not found. Run dealer.seed.js first!");
    }
    const dealerId = dealer._id;
    console.log('Found dealer with ID:', dealerId);

    // Clear existing cars
    await CarModel.deleteMany({});
    console.log('Cleared existing cars');

    // Link sample cars to the dealer ID
    const carsToInsert = sampleCars.map(car => ({
      ...car,
      dealer: dealerId
    }));

    // Insert sample cars
    const cars = await CarModel.insertMany(carsToInsert);
    console.log('Added sample cars:', cars.length);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding cars:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedCars();
