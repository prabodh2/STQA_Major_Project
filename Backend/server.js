// Polyfill for Node.js 24+ where SlowBuffer is removed but still needed by older dependencies like buffer-equal-constant-time
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = class SlowBuffer extends buffer.Buffer {};
}

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const { userRouter } = require("./routes/user.routes");
const cloudinary = require("cloudinary");
const { oemRouter } = require("./routes/oem.routes");
const { inventoryRouter } = require("./routes/inventory.routes");
const { authmiddleware } = require("./middlewares/auth.middleware");
const { ImageUploadRouter } = require("./routes/ImageUpload.routes");
const enquiryRouter = require("./routes/enquiry.routes");
const { carRouter } = require("./routes/cars.routes");
const { DealerModel } = require('./model/dealer.model');

// Debug line to check environment variables
console.log("Server environment variables:", {
    secretKey: process.env.SECRET_KEY,
    mongoUrl: process.env.MONGO_URL
});

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use("/user",userRouter);
app.use("/oem",oemRouter);
app.use("/inventory",inventoryRouter);
app.use('/upload',ImageUploadRouter);
app.use("/enquiries", enquiryRouter);
app.use("/cars", carRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;

(async function(){
    try {
        await connection;
        console.log("db is connected");
        app.listen(PORT, async ()=>{
            console.log(`server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Error starting server:", error)
    }
})();
