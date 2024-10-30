import React, { useState } from 'react';
import axios from 'axios';


const SearchMaterial = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://papakay.vercel.app/materials/search?name=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching materials:', error);
        }
    };

    return (
        <div>
            <h2>Search Materials</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter material name or vessel"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {searchResults.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Description</th>
                            <th>Vessel</th>
                            <th>Date Logged</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((material) => (
                            <tr key={material._id}>
                                <td>{material.name}</td>
                                <td>{material.quantity}</td>
                                <td>{material.description}</td>
                                <td>{material.vessel}</td>
                                <td>{new Date(material.dateLogged).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchMaterial;
