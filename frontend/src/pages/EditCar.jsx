import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { editCar } from "../redux/ProductReducer/action";
import { toast } from "react-toastify";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cars, isLoading } = useSelector((store) => {
    console.log('Redux Store State:', store);
    return store.ProductReducer || { cars: [], isLoading: false };
  });

  const [car, setCar] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Find the car to edit
  useEffect(() => {
    const carToEdit = cars.find(c => c._id === id);
    if (carToEdit) {
      setCar(carToEdit);
      setImageURL(carToEdit.image || "");
    } else {
      toast.error("Car not found");
      navigate("/dealer-cars");
    }
  }, [id, cars, navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!localStorage.getItem("token")) {
      toast.error("Please login first!");
      return;
    }

    if (localStorage.getItem("userRole") !== "dealer") {
      toast.error("Only dealers can edit cars!");
      return;
    }

    // Validate numeric fields
    const numericFields = {
      price: "Price",
      kmOnOdometer: "Kilometers on Odometer",
      accidentsReported: "Accidents Reported",
      previousBuyers: "Previous Buyers"
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = car[field];
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
        const value = car[key];
        return value === undefined || value === null || value === '' || 
               (typeof value === 'string' && value.trim() === '');
      })
      .map(([key, label]) => label);

    if (emptyFields.length > 0) {
      toast.error(`Please fill the following fields: ${emptyFields.join(", ")}`);
      return;
    }

    console.log("Submitting updated car data:", car);

    // Submit the form
    dispatch(editCar(car, id))
      .then((response) => {
        console.log("Success response:", response);
        toast.success("Car updated successfully!");
        navigate("/dealer-cars");
      })
      .catch((error) => {
        console.error("Error updating car:", error);
        const errorMessage = error.response?.data?.error || error.message || "Failed to update car";
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

  if (!car) {
    return (
      <Container>
        <h2>Loading...</h2>
      </Container>
    );
  }

  return (
    <Container>
      <h2>EDIT CAR DETAILS</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={car.title}
            onChange={handleChange}
            placeholder="Enter car title"
          />
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <textarea
            name="description"
            value={car.description}
            onChange={handleChange}
            placeholder="Enter car description"
          />
        </FormGroup>

        <IMGUPLOAD>
          <FormGroup>
            <label>Current Image</label>
            {car.image && (
              <img 
                src={car.image} 
                alt="Current car" 
                style={{ maxWidth: "200px", marginBottom: "10px" }}
              />
            )}
          </FormGroup>
          <FormGroup>
            <label>Upload New Image</label>
            <CloudinaryUploadWidget setImageURL={setImageURL} />
          </FormGroup>
        </IMGUPLOAD>

        <FormGroup>
          <label>Kilometers on Odometer</label>
          <input
            type="number"
            name="kmOnOdometer"
            value={car.kmOnOdometer}
            onChange={handleChange}
            min="0"
            placeholder="Enter kilometers on odometer"
          />
        </FormGroup>

        <FormGroup>
          <label>Major Scratches</label>
          <input
            type="text"
            name="majorScratches"
            value={car.majorScratches}
            onChange={handleChange}
            placeholder="Describe major scratches"
          />
        </FormGroup>

        <FormGroup>
          <label>Original Paint</label>
          <input
            type="text"
            name="originalPaint"
            value={car.originalPaint}
            onChange={handleChange}
            placeholder="Enter original paint color"
          />
        </FormGroup>

        <FormGroup>
          <label>Number of Accidents Reported</label>
          <input
            type="number"
            name="accidentsReported"
            value={car.accidentsReported}
            onChange={handleChange}
            min="0"
            placeholder="Enter number of accidents"
          />
        </FormGroup>

        <FormGroup>
          <label>Number of Previous Buyers</label>
          <input
            type="number"
            name="previousBuyers"
            value={car.previousBuyers}
            onChange={handleChange}
            min="0"
            placeholder="Enter number of previous buyers"
          />
        </FormGroup>

        <FormGroup>
          <label>Registration Place</label>
          <input
            type="text"
            name="registrationPlace"
            value={car.registrationPlace}
            onChange={handleChange}
            placeholder="Enter registration place"
          />
        </FormGroup>

        <FormGroup>
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={car.price}
            onChange={handleChange}
            min="0"
            placeholder="Enter price in INR"
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Car"}
          </Button>
          <Button type="button" onClick={() => navigate("/dealer-cars")} secondary>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default EditCar;

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
`;

const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #2c5282;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const IMGUPLOAD = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  > div {
    flex: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.secondary ? '#718096' : '#2c5282'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.secondary ? '#4a5568' : '#2a4365'};
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;
