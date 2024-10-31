import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MaterialForm from './components/MaterialForm';
import MaterialList from './components/MaterialsInTransit';
import ShippedItems from './components/ShippedItems';
import SearchMaterial from './components/SearchMaterial';
import './App.css';
import wallpaper from './wallpaper.jpg';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/log-material">Log Material</Link></li>
                        <li><Link to="/materials">Materials in Transit</Link></li>
                        <li><Link to="/shipped-items">Shipped Items</Link></li>
                        <li><Link to="/search">Search Materials</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <div className="home-container">
                                <h1>
                                    <a href="https://github.com/Jayminai/" className="custom-link">Jayminai</a> 
                                    Inventory Management App
                                </h1>
                                <img src={wallpaper} alt="Jayminai Logo" className="logo-image" />
                            </div>
                        }
                    />
                    <Route path="/log-material" element={<MaterialForm />} />
                    <Route path="/materials" element={<MaterialList />} />
                    <Route path="/shipped-items" element={<ShippedItems />} />
                    <Route path="/search" element={<SearchMaterial />} />
                </Routes>
                
            </div>
        </Router>
    );
};

export default App;
