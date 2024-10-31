import React, { useState } from 'react';
import axios from 'axios';

const MaterialForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        description: '',
        vessel: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://papakay.vercel.app/materials', formData);
            alert('Material logged successfully');
            setFormData({
                name: '',
                quantity: '',
                description: '',
                vessel: ''
            });
        } catch (error) {
            alert('Error logging material');
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
                Quantity:
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
            </label>
            <label>
                Description:
                <select name="description" value={formData.description} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="From Head Office">From Head Office</option>
                    <option value="Supplied">Supplied</option>
                </select>
            </label>
            <label>
                Vessel:
                <input type="text" name="vessel" value={formData.vessel} onChange={handleChange} required />
            </label>
            <button type="submit">Log Material</button>
        </form>
    );
};

export default MaterialForm;
