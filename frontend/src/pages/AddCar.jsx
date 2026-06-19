import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addCar } from "../redux/ProductReducer/action";
import styled from "styled-components";
import { toast } from "react-toastify";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { useNavigate } from "react-router-dom";

console.log('AddCar component loaded');

const initialState = {
  title: "",
  description: "",
  image: "",
  kmOnOdometer: "",
  majorScratches: "",
  accidentsReported: "",
  previousBuyers: "",
  registrationPlace: "",
  originalPaint: "",
  price: "",
  oemSpecs: null
};

const AddCar = () => {
  console.log('AddCar component rendering');
  
  const [car, setCar] = useState(initialState);
  const [search, setSearch] = useState("");
  const [oemSpecs, setOemSpecs] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const dispatch = useDispatch();
  
  // Add error boundary around useSelector
  const { isLoading, isError } = useSelector((store) => {
    console.log('Redux Store State:', store);
    if (!store) {
      console.error('Store is undefined');
      return { isLoading: false, isError: false };
    }
    if (!store.ProductReducer) {
      console.error('ProductReducer is undefined in store:', store);
      return { isLoading: false, isError: false };
    }
    return store.ProductReducer;
  });

  console.log('Component state:', { isLoading, isError });
  
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["price", "kmOnOdometer", "accidentsReported", "previousBuyers"];
    
    if (name === "previousBuyers" && parseInt(value) < 0) {
      return; // Don't update state if previousBuyers is negative
    }
    
    setCar(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === "" ? "" : parseInt(value)) : value,
      image: imageURL
    }));
  };

  const handleModelSelect = (el) => {
    const modelString = `${el.model_name} (${el.year}) - ${el.colors}`;
    setSelectedModel(modelString);
    
    // Clean and validate OEM specs data
    const colors = el.colors?.split(",").map(c => c.trim()).filter(Boolean) || [];
    
    setCar(prev => ({
      ...prev,
      oemSpecs: {
        model: el.model_name || "",
        year: parseInt(el.year) || new Date().getFullYear(),
        transmission: el.transmission || "",
        fuelType: el.fuel_type || "",
        mileage: el.mileage?.toString() || "",
        colors: colors,
        power: el.power?.toString() || "",
        maxSpeed: el.maxspeed?.toString() || "",
        acceleration: el.acceleration?.toString() || ""
      }
    }));
    setSearch("");
  };

  useEffect(() => {
    const fetchOEMSpecs = async () => {
      try {
        if (search.trim() !== "") {
          const response = await axios.get(`http://localhost:4000/oem/specs?q=${search}`);
          console.log("OEM Specs Response:", response.data);
          if (response.data && response.data.specification) {
            setOemSpecs(response.data.specification);
          }
        } else {
          setOemSpecs([]);
        }
      } catch (err) {
        console.error("Error fetching OEM specs:", err);
        toast.error("Error fetching car models");
      }
    };

    const debounceTimer = setTimeout(fetchOEMSpecs, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!localStorage.getItem("token")) {
      toast.error("Please login first!");
      return;
    }

    if (localStorage.getItem("userRole") !== "dealer") {
      toast.error("Only dealers can add cars!");
      return;
    }

    // Create submission data without oemSpecs first
    const submissionData = {
      title: car.title?.trim(),
      description: car.description?.trim(),
      image: car.image?.trim(),
      kmOnOdometer: parseInt(car.kmOnOdometer),
      majorScratches: car.majorScratches?.trim(),
      originalPaint: car.originalPaint?.trim(),
      accidentsReported: parseInt(car.accidentsReported),
      previousBuyers: parseInt(car.previousBuyers),
      registrationPlace: car.registrationPlace?.trim(),
      price: parseInt(car.price)
    };

    // Validate numeric fields
    const numericFields = {
      price: "Price",
      kmOnOdometer: "Kilometers on Odometer",
      accidentsReported: "Accidents Reported",
      previousBuyers: "Previous Buyers"
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = submissionData[field];
      if (isNaN(value) || value < 0) {
        toast.error(`${label} must be a valid non-negative number`);
        return;
      }
    }

    // Validate required fields
    const requiredFields = {
      title: "Title",
      description: "Description",
      image: "Image",
      kmOnOdometer: "Kilometers on Odometer",
      majorScratches: "Major Scratches",
      originalPaint: "Original Paint",
      accidentsReported: "Accidents Reported",
      previousBuyers: "Previous Buyers",
      registrationPlace: "Registration Place",
      price: "Price"
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([key, label]) => {
        const value = submissionData[key];
        return value === undefined || value === null || value === '' || 
               (typeof value === 'string' && value.trim() === '');
      })
      .map(([key, label]) => label);

    if (emptyFields.length > 0) {
      toast.error(`Please fill the following fields: ${emptyFields.join(", ")}`);
      return;
    }

    // Only add oemSpecs if a model was selected
    if (selectedModel && car.oemSpecs) {
      const titleFirstWord = submissionData.title ? submissionData.title.split(" ")[0] : "Honda";
      const specs = {
        model: car.oemSpecs.model,
        year: parseInt(car.oemSpecs.year) || 2020,
        transmission: car.oemSpecs.transmission || "Manual",
        fuelType: car.oemSpecs.fuelType || "Petrol",
        mileage: parseFloat(car.oemSpecs.mileage) || 15,
        power: car.oemSpecs.power || "100 PS",
        maxSpeed: parseInt(car.oemSpecs.maxSpeed) || 180,
        acceleration: car.oemSpecs.acceleration || "10s",
        colors: car.oemSpecs.colors?.filter(Boolean) || [],
        brand: titleFirstWord
      };
      submissionData.oemSpecs = specs;
    }

    console.log("Submitting car data:", submissionData);

    // Submit the form
    dispatch(addCar(submissionData))
      .then((response) => {
        console.log("Success response:", response);
        toast.success("Car added successfully!");
        navigate("/dealer-cars");
      })
      .catch((error) => {
        console.error("Error adding car:", error);
        const errorMessage = error.response?.data?.error || error.message || "Failed to add car";
        const errorDetails = error.response?.data?.details;
        
        if (Array.isArray(errorDetails)) {
          toast.error(`${errorMessage}: ${errorDetails.join(", ")}`);
        } else if (typeof errorDetails === 'object') {
          const details = Object.values(errorDetails).join(", ");
          toast.error(`${errorMessage}: ${details}`);
        } else {
          toast.error(errorMessage);
        }
      });
  };

  return (
    <DIV>
      <h2>ADD YOUR CAR DETAILS HERE</h2>
      <div className="form">
        <label>Search Car Model (Optional)</label>
        <input
          placeholder="Type to search car models (optional)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="searchModel"
          type="text"
          className="search-input"
        />

        {search.trim() !== "" && oemSpecs.length > 0 && (
          <div className="search-div">
            {oemSpecs.map((el) => (
              <div
                key={el._id}
                className="card"
                onClick={() => handleModelSelect(el)}
              >
                <p>{`${el.model_name} (${el.year}) - ${el.colors}`}</p>
                <small>Power: {el.power}, Mileage: {el.mileage}</small>
              </div>
            ))}
          </div>
        )}

        <label>Selected Model (Optional)</label>
        <input
          placeholder="No model selected (optional)"
          value={selectedModel}
          name="selectedModel"
          readOnly
          disabled
        />

        <label>Title</label>
        <input
          placeholder="title"
          onChange={handleChange}
          value={car.title}
          name="title"
        />

        <label>Description</label>
        <textarea
          placeholder="Description"
          onChange={handleChange}
          value={car.description}
          name="description"
        />
        <label>Price</label>
        <input
          placeholder="Price"
          onChange={handleChange}
          value={car.price?.toString() || ""}
          name="price"
          type="number"
        />

        <IMGUPLOAD>
        <CloudinaryUploadWidget setImageURL={setImageURL}/>
        </IMGUPLOAD>
        <input
          placeholder="Image"
          value={imageURL}
          name="image"
          disabled
        />
        
        <label>km On Odometer</label>
        <input
          placeholder="kmOnOdometer"
          onChange={handleChange}
          value={car.kmOnOdometer?.toString() || ""}
          name="kmOnOdometer"
          type="number"
        />

        <label>Major Scratches</label>
        <input
          placeholder="Major Scratches"
          onChange={handleChange}
          value={car.majorScratches}
          name="majorScratches"
        />

        <label>Accidents Reported</label>
        <input
          placeholder="Accidents Reported"
          onChange={handleChange}
          value={car.accidentsReported?.toString() || ""}
          name="accidentsReported"
          type="number"
        />

        <label>Previous Buyers</label>
        <input
          placeholder="Previous Buyers"
          onChange={handleChange}
          value={car.previousBuyers}
          name="previousBuyers"
          type="number"
          min="0"
          onKeyDown={(e) => {
            if (e.key === '-') {
              e.preventDefault();
            }
          }}
        />

        <label>Registration Place</label>
        <input
          placeholder="Registration Place"
          onChange={handleChange}
          value={car.registrationPlace}
          name="registrationPlace"
        />

        <label>Original Paint</label>
        <select
          name="originalPaint"
          value={car.originalPaint}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <button onClick={handleSubmit} disabled={isLoading}>
          {!isLoading ? "ADD" : "Adding..."}
        </button>
      </div>
    </DIV>
  );
};

export default AddCar;

const IMGUPLOAD = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`

const DIV = styled.div`
  width: 400px;
  margin: 40px auto;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 5px;

  h2 {
    text-align: center;
    color: #2d3436;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    position: relative;
  }

  label {
    font-weight: 600;
    color: #2d3436;
  }

  input, textarea {
    padding: 8px;
    border: 1px solid #b2bec3;
    border-radius: 4px;
    font-size: 14px;
    &:focus {
      outline: none;
      border-color: #74b9ff;
    }
  }

  .search-div {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #dfe6e9;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .card {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    
    &:hover {
      background-color: #f5f6fa;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #2d3436;
    }

    small {
      color: #636e72;
      font-size: 12px;
    }
  }

  .search-input {
    margin-bottom: 5px;
  }

  button {
    background-color: #0984e3;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 10px;

    &:hover {
      background-color: #74b9ff;
    }
  }
`;
