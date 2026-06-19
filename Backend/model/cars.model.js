const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative']
  },
  oemSpecs: {
    colors: {
      type: [String],
      required: true
    },
    mileage: {
      type: Number,
      required: true,
      min: [0, 'Mileage cannot be negative']
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    }
  },
  kmOnOdometer: {
    type: Number,
    required: true,
    min: [0, 'Kilometers cannot be negative']
  },
  majorScratches: {
    type: String,
    required: true,
    trim: true
  },
  originalPaint: {
    type: String,
    required: true,
    trim: true
  },
  accidentsReported: {
    type: Number,
    required: true,
    min: [0, 'Accidents reported cannot be negative']
  },
  previousBuyers: {
    type: Number,
    required: true,
    min: [0, 'Previous buyers cannot be negative']
  },
  registrationPlace: {
    type: String,
    required: true,
    trim: true
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});

const CarModel = mongoose.model("car", carSchema);

module.exports = {
  CarModel
};
