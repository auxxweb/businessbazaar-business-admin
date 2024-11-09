import React, { useState } from 'react';
// import 'src/ContactForm.css'; // Import the CSS file
import "react-phone-input-2/lib/style.css";
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here, e.g., sending data to a server
    console.log(formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="contact-form-container bg-light w-lg mx-10">
      <form onSubmit={handleSubmit} className="contact-form">
        <h2 className="form-title">Contact Us</h2>
        <div className="form-group">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-control"
          ></textarea>
        </div>
        <div  className="d-flex justify-content-center align-items-center mt-4">
        <button type="submit" className="submit-button"         style={{
                      backgroundColor: "black",
                      borderRadius: "10px",
                    //   borderBottomLeftRadius: "50px",
                      border: "1px solid #ced4da",
                    }}>
          Send Message
        </button>
    </div>

      </form>
    </div>
  );
}

export default ContactForm;