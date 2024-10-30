import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaterialsInTransit = () => {
    const [materials, setMaterials] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('https://papakay.vercel.app/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials', error);
            alert('Error fetching materials. Please try again later.');
        }
    };

    const handleEditClick = (material) => {
        setCurrentItem(material);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        setCurrentItem({
            ...currentItem,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://papakay.vercel.app/materials/${currentItem._id}`, currentItem); 
            alert('Item updated successfully');
            setIsEditing(false);
            fetchMaterials(); 
        } catch (error) {
            console.error('Error updating item', error);
            alert('Error updating item. Please try again.');
        }
    };

    const handleMarkAsShipped = async (id) => {
        try {
            const material = materials.find((item) => item._id === id);
            if (!material) {
                alert('Material not found');
                return;
            }
            await axios.post(`https://papakay.vercel.app/materials/${id}/ship`, {
                ...material,
                dateShipped: new Date().toISOString(),
            });
            alert('Item marked as shipped');
            fetchMaterials(); // Refresh the list
        } catch (error) {
            console.error('Error marking item as shipped', error);
            alert('Error marking item as shipped. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await axios.delete(`https://papakay.vercel.app/materials/${id}`);
                alert('Material deleted successfully');
                fetchMaterials(); 
            } catch (error) {
                console.error('Error deleting material', error);
                alert('Error deleting material. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Materials in Transit Store</h2>

            {isEditing && currentItem ? (
                <form onSubmit={handleEditSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={currentItem.name}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            value={currentItem.quantity}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <select
                            name="description"
                            value={currentItem.description}
                            onChange={handleEditChange}
                            required
                        >
                            <option value="From Head Office">From Head Office</option>
                            <option value="Supplied">Supplied</option>
                        </select>
                    </label>
                    <label>
                        Vessel:
                        <input
                            type="text"
                            name="vessel"
                            value={currentItem.vessel}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <button type="submit">Update Item</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Description</th>
                            <th>Vessel</th>
                            <th>Date Logged</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material) => (
                            <tr key={material._id}>
                                <td>{material.name}</td>
                                <td>{material.quantity}</td>
                                <td>{material.description}</td>
                                <td>{material.vessel}</td>
                                <td>{new Date(material.dateLogged).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="table-button"
                                        onClick={() => handleEditClick(material)}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="table-button"
                                        onClick={() => handleMarkAsShipped(material._id)}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                                    >
                                        Shipped
                                    </button>
                                    <button
                                        className="table-button"
                                        onClick={() => handleDelete(material._id)}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MaterialsInTransit;
