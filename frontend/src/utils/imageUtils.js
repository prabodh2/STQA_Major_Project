import { getRandomCarImage } from '../constants/carImages';

// Cache for storing validated image URLs
const imageCache = new Map();

// Function to validate image URL
export const validateImageUrl = async (url) => {
  if (!url) return getRandomCarImage();
  
  // Check cache first
  if (imageCache.has(url)) {
    return imageCache.get(url) || getRandomCarImage();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (response.ok && response.headers.get('content-type')?.includes('image')) {
      imageCache.set(url, url);
      return url;
    } else {
      imageCache.set(url, null);
      return getRandomCarImage();
    }
  } catch (error) {
    imageCache.set(url, null);
    return getRandomCarImage();
  }
};

// Function to transform car data with valid image URLs
export const transformCarData = async (car) => {
  if (!car) return null;
  const validImageUrl = await validateImageUrl(car.image);
  return {
    ...car,
    image: validImageUrl
  };
};

// Function to transform multiple car data entries
export const transformCarsData = async (cars) => {
  if (!Array.isArray(cars)) return [];
  return await Promise.all(cars.map(transformCarData));
};
