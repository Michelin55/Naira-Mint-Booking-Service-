import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [occasion, setOccasion] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);

  const form = useRef();

  const products = [
    { id: 1, name: '5 naira', price: 500 },
    { id: 2, name: '10 naira', price: 1000 },
    { id: 3, name: '20 naira', price: 2000 },
    { id: 4, name: '50 naira', price: 5000 },
    { id: 5, name: '100 naira', price: 10000 },
    { id: 6, name: '200 naira', price: 20000 },
    { id: 7, name: '500 naira', price: 50000 },
    { id: 8, name: '1000 naira', price: 100000 },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      
      window.PaystackPop = window.PaystackPop || {};
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const sendEmail = () => {
    emailjs
      .sendForm('service_a0u247m', 'template_p4oecs4', form.current, 'GHgMzgY7B1btljUsh')
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  const handleCheckboxChange = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    let updatedProducts = [];
    let updatedTotal = totalAmt;
  
    if (isSelected) {
      // Remove the product from selectedProducts
      updatedProducts = selectedProducts.filter(p => p.id !== product.id);
      // Deduct the product's price from the total amount
      updatedTotal -= product.price;
    } else {
      // Add the product to selectedProducts
      updatedProducts = [...selectedProducts, product];
      // Add the product's price to the total amount
      updatedTotal += product.price;
    }
  
    // Update the selected products and total amount state
    setSelectedProducts(updatedProducts);
    setTotalAmt(updatedTotal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking Submitted!');
    sendEmail();

    const handler = window.PaystackPop.setup({
      key: 'pk_test_8c05fc1dd51d2921f9fded4a23aff628161fa7a1', 
      email: email,
      amount: totalAmt * 100, 
      metadata: {
        items: selectedProducts.map(item => ({
          name: name,
          price: item.price,
          items: selectedProducts,
          currency: 'NGN',
         date: date,
        })),
      },
      callback: function(response) {
        axios.post("http://localhost:5000/verify-payment", {
          reference: response.reference,
          
        })
        .then(response => {
          
          alert('Payment successful. Reference: ' + response.data.reference);
        })
        .catch(error => {
          console.error('Error verifying payment:', error);
          alert('An error occurred while verifying the payment. Please try again.');
        });
      },
      onClose: function() {
        alert('Payment window closed.');
      }
    });

    handler.openIframe();
    e.target.reset();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Book Mint for Your Occasion</h3>
            </div>
            <div className="card-body">
              <form ref={form} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name='user_name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name='user_email'
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occasion">Occasion</label>
                  <select
                    className="form-control"
                    id="occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    required
                  >
                    <option value="">Select Occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    className="form-control"
                    id="note"
                    name='message'
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Products</label>
                  {products.map(product => (
                    <div key={product.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`product-${product.id}`}
                        value={product.name}
                        onChange={() => handleCheckboxChange(product)}
                      />
                      <label className="form-check-label" htmlFor={`product-${product.id}`}>
                        {product.name} - #{product.price}
                      </label>
                    </div>
                  ))}
                </div>
                <h4>Total Amount: #{totalAmt}</h4>
                <button type="submit" className="btn btn-primary mt-3">
                  Submit Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
