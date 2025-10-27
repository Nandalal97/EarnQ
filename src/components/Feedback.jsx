// components/FeedbackModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import feedbackLanguage from '../language/feedback.json'

function FeedbackModal({ show, handleClose, start = 60, onComplete }) {

   const defaultLang = localStorage.getItem('lang') || 'en';
  const [lang] = useState(defaultLang);
  const trans = feedbackLanguage[lang] || feedbackLanguage['en'];



  const [timeLeft, setTimeLeft] = useState(start);
  // Reset timer when modal is shown
  useEffect(() => {
    if (show) setTimeLeft(start);
  }, [show, start]);
  // Countdown logic
  useEffect(() => {
    if (!show) return;

    if (timeLeft <= 0) {
      if (onComplete) onComplete(); 
      handleClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, show, onComplete, handleClose]);
  // close modal end

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    rating: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRating = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback:', formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className='py-2'>
        <Modal.Title>{trans.feedbackTtile}</Modal.Title>
        <span className="ms-3 text-danger fw-bolder">{timeLeft}s</span>
      </Modal.Header>
      <Modal.Body className='pt-1'>
        <p className='pb-2'>{trans.feedbackText}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-control mb-2"
            placeholder={trans.feedbackName}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            className="form-control mb-2"
            placeholder={trans.feedbackPhone}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            placeholder={trans.feedbackEmail}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            className="form-control mb-2"
            placeholder={trans.feedbackMessage}
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <div className="mb-3">
            <label className="form-label">{trans.feedbackRating}: </label>{' '}
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                onClick={() => handleRating(star)}
                style={{ cursor: 'pointer', marginRight: 5 }}
                color={star <= formData.rating ? '#ffc107' : '#e4e5e9'}
              />
            ))}
          </div>

          <span className="w-100 bg-one btn-invite color-white">
            {trans.feedbackButton}
          </span>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default FeedbackModal;
