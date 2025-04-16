'use client'

import { useState } from 'react';

const ContactForm = ({ therapistId }: { therapistId: string }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch('http://localhost:8000/contact-professional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, therapistId }),
    });

    if (res.ok) {
      setStatus("Message sent!");
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus("Error sending message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-lg rounded-2xl">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full p-2 border rounded bg-white"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full p-2 border rounded bg-white"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full p-2 border rounded bg-white"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Send Message
      </button>
      <p className="text-sm text-gray-600">{status}</p>
    </form>
  );
};

export default ContactForm;