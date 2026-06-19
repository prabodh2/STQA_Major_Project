import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { fetchregister } from "../redux/AuthReducer/action";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaUserTie } from "react-icons/fa";

const initialState = {
  email: "",
  name: "",
  password: "",
  role: "user"
};

const Register = () => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState(initialState);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const navigate = useNavigate();
  const { isLoading, isError } = useSelector((store) => store.AuthReducer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleLogin = () => {
    if (password !== cpassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(fetchregister(details)).then(() => {
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login");
    }).catch((error) => {
      toast.error(error.message || "Registration failed", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  };

  return (
    <DIV>
      <div className="form-container">
        <h2>Create Account</h2>
        <div className="register-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={details.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={details.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setDetails({ ...details, password: e.target.value });
              }}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group role-group">
            <FaUserTie className="icon" />
            <select
              name="role"
              value={details.role}
              onChange={handleChange}
              required
            >
              <option value="user">Regular User</option>
              <option value="dealer">Car Dealer</option>
            </select>
          </div>

          <button 
            className="register-button" 
            onClick={handleLogin} 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </DIV>
  );
};

export default Register;

const DIV = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #f7fafc;

  .form-container {
    background: white;
    padding: 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    h2 {
      text-align: center;
      color: #2d3748;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    position: relative;

    .icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #718096;
    }

    input, select {
      width: 100%;
      padding: 0.75rem;
      padding-left: 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
      }
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
    }
  }

  .role-group {
    select {
      color: #2d3748;
      cursor: pointer;

      &:hover {
        border-color: #4299e1;
      }
    }
  }

  .register-button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.75rem;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #3182ce;
    }

    &:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
    }
  }
`;
