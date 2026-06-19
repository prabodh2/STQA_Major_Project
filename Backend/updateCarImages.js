const mongoose = require('mongoose');
require('dotenv').config();

// Import your Car model
const Car = require('./models/car');

const NEW_CAR_IMAGES = {
  'Honda City 2020': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1280&h=720',
  'Toyota Innova 2019': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1280&h=720',
  'Hyundai i20 2021': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1280&h=720'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1280&h=720';

async function updateCarImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update each car's image
    const cars = await Car.find({});
    
    for (const car of cars) {
      const newImage = NEW_CAR_IMAGES[car.title] || DEFAULT_IMAGE;
      await Car.findByIdAndUpdate(car._id, { image: newImage });
      console.log(`Updated image for ${car.title}`);
    }

    console.log('All car images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating car images:', error);
    process.exit(1);
  }
}

updateCarImages();
