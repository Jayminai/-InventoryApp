import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShippedItems = () => {
    const [shippedItems, setShippedItems] = useState([]);

    useEffect(() => {
        const fetchShippedItems = async () => {
            try {
                const response = await axios.get('https://papakay.vercel.app/shipped');
                setShippedItems(response.data);
            } catch (error) {
                console.error('Error fetching shipped items', error);
            }
        };

        fetchShippedItems();
    }, []);

    return (
        <div className="container">
            <h2>Shipped Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Vessel</th>
                        <th>Date Shipped</th>
                    </tr>
                </thead>
                <tbody>
                    {shippedItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.description}</td>
                            <td>{item.vessel}</td>
                            <td>{new Date(item.dateShipped).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShippedItems;
