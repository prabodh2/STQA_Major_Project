import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { styled } from "styled-components";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialColors = searchParams.getAll("colors");
  const initialPrice = searchParams.get("price");
  const initialMileage = searchParams.get("mileage");

  const [colors, setColors] = useState(initialColors || []);
  const [price, setPrice] = useState(initialPrice || "");
  const [mileage, setMileage] = useState(initialMileage || "");
  const [clear, setClear] = useState(false);

  useEffect(() => {
    let params = {};
    if (colors.length) params.colors = colors;
    if (price) params.price = price;
    if (mileage) params.mileage = mileage;
    setSearchParams(params);
  }, [colors, price, mileage, clear, setSearchParams]);

  const handleColorChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setColors([...colors, value]);
    } else {
      setColors(colors.filter(color => color !== value));
    }
  };

  const handlePriceSort = (e) => {
    setPrice(e.target.value);
  };

  const handleMileageSort = (e) => {
    setMileage(e.target.value);
  };

  const handleReset = () => {
    setColors([]);
    setPrice("");
    setMileage("");
    setClear(!clear);
  };

  return (
    <SidebarContainer>
      <div className="filter-section">
        <h3>Filters</h3>
        <button onClick={handleReset}>Reset Filters</button>
      </div>

      <div className="filter-section">
        <h4>Colors</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="red"
              onChange={handleColorChange}
              checked={colors.includes("red")}
            />
            Red
          </label>
          <label>
            <input
              type="checkbox"
              value="blue"
              onChange={handleColorChange}
              checked={colors.includes("blue")}
            />
            Blue
          </label>
          <label>
            <input
              type="checkbox"
              value="white"
              onChange={handleColorChange}
              checked={colors.includes("white")}
            />
            White
          </label>
          <label>
            <input
              type="checkbox"
              value="black"
              onChange={handleColorChange}
              checked={colors.includes("black")}
            />
            Black
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Price</h4>
        <div>
          <label>
            <input
              type="radio"
              name="price"
              value="asc"
              onChange={handlePriceSort}
              checked={price === "asc"}
            />
            Low to High
          </label>
          <label>
            <input
              type="radio"
              name="price"
              value="desc"
              onChange={handlePriceSort}
              checked={price === "desc"}
            />
            High to Low
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Mileage</h4>
        <div>
          <label>
            <input
              type="radio"
              name="mileage"
              value="asc"
              onChange={handleMileageSort}
              checked={mileage === "asc"}
            />
            Low to High
          </label>
          <label>
            <input
              type="radio"
              name="mileage"
              value="desc"
              onChange={handleMileageSort}
              checked={mileage === "desc"}
            />
            High to Low
          </label>
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .filter-section {
    margin-bottom: 20px;

    h3, h4 {
      margin-bottom: 10px;
      color: #333;
    }

    button {
      padding: 8px 16px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: #e0e0e0;
      }
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        input {
          cursor: pointer;
        }
      }
    }
  }
`;
