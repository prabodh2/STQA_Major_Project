const cars = [
  {
    title: "Honda City 2020",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1280&h=720",
    description: "Well-maintained Honda City with all service records",
    price: 1200000,
    kmOnOdometer: 25000,
    majorScratches: "No",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 1,
    registrationPlace: "Mumbai",
    oemSpecs: {
      model: "City",
      year: 2020,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "18.4 kmpl",
      colors: ["White", "Silver", "Black"],
      power: "119 PS",
      maxSpeed: "195 kmph",
      acceleration: "0-100 in 10.2 seconds"
    }
  },
  {
    title: "Toyota Innova 2019",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1280&h=720",
    description: "Family car in excellent condition",
    price: 1800000,
    kmOnOdometer: 45000,
    majorScratches: "No",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 1,
    registrationPlace: "Delhi",
    oemSpecs: {
      model: "Innova",
      year: 2019,
      transmission: "Manual",
      fuelType: "Diesel",
      mileage: "15.6 kmpl",
      colors: ["Grey", "White", "Silver"],
      power: "148 PS",
      maxSpeed: "170 kmph",
      acceleration: "0-100 in 12.8 seconds"
    }
  },
  {
    title: "Hyundai i20 2021",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1280&h=720",
    description: "Premium hatchback with all features",
    price: 900000,
    kmOnOdometer: 15000,
    majorScratches: "No",
    originalPaint: "Yes",
    accidentsReported: 0,
    previousBuyers: 0,
    registrationPlace: "Bangalore",
    oemSpecs: {
      model: "i20",
      year: 2021,
      transmission: "Manual",
      fuelType: "Petrol",
      mileage: "20.2 kmpl",
      colors: ["Red", "Blue", "White"],
      power: "88 PS",
      maxSpeed: "180 kmph",
      acceleration: "0-100 in 11.8 seconds"
    }
  }
];

module.exports = { cars };
