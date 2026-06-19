require('dotenv').config();
console.log('Testing environment variables:');
console.log('SECRET_KEY:', process.env.SECRET_KEY);
console.log('MONGO_URL:', process.env.MONGO_URL);
