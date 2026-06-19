import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaComment, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/axiosConfig';

const ContactModal = ({ isOpen, onClose, carTitle, carId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post('/enquiries', {
        ...formData,
        carId,
        carTitle
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitStatus === 'success') {
    return (
      <ModalOverlay>
        <ModalContent>
          <SuccessMessage>
            <FaCheckCircle />
            <h3>Thank You!</h3>
            <p>Your enquiry has been submitted successfully. We'll contact you soon.</p>
          </SuccessMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Contact Dealer</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <CarInfo>
          Enquiry for: <span>{carTitle}</span>
        </CarInfo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputWrapper>
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <FaPhone />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <FaComment />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </InputWrapper>
          </FormGroup>

          {submitStatus === 'error' && (
            <ErrorMessage>
              There was an error submitting your enquiry. Please try again.
            </ErrorMessage>
          )}

          <SubmitButton 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Enquiry'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ContactModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;

  h2 {
    color: #1a237e;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #1a237e;
  }
`;

const CarInfo = styled.div`
  padding: 16px 24px;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 0.95rem;

  span {
    color: #1a237e;
    font-weight: 500;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #1a237e;
    font-size: 1rem;
  }

  input, textarea {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #1a237e;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #0d47a1;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px 24px;

  svg {
    font-size: 4rem;
    color: #4caf50;
    margin-bottom: 16px;
  }

  h3 {
    color: #1a237e;
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  p {
    color: #6c757d;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  text-align: center;
`;
