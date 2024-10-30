const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

PORT = 3000

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Material Schema
const materialSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    description: String,  // From Head Office or Supplied
    vessel: String,
    dateLogged: { type: Date, default: Date.now },
    isShipped: { type: Boolean, default: false },
    dateShipped: Date // Added this line to store the shipping date
});

const Material = mongoose.model('Material', materialSchema);

// Email reminder system
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Cron job to check for items in the Transit Store for more than two weeks
cron.schedule('0 0 * * 0', async () => {
    // Set time to 2 weeks ago
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const items = await Material.find({ dateLogged: { $lte: twoWeeksAgo }, isShipped: false });

    if (items.length > 0) {
        const emailContent = items.map(item => 
            `Item: ${item.name}\nQuantity: ${item.quantity}\nDescription: ${item.description}\nVessel: ${item.vessel}\nDate Logged: ${item.dateLogged}`
        ).join('\n\n');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'georgegodstime62@gmail.com',
            subject: 'Items in Transit Store for more than two weeks',
            text: emailContent
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    } else {
        console.log('No items found in Transit Store for more than two weeks');
    }
});
// Add a new material
app.post('/materials', async (req, res, next) => {
    const { name, quantity, description, vessel } = req.body;
    try {
        const newMaterial = new Material({ 
            name, 
            quantity, 
            description, 
            vessel 
        });
        await newMaterial.save();
        res.status(201).json(newMaterial);
    } catch (error) {
        next(error);
    }
});

app.get('/materials', async (req, res, next) => {
    try {
        const materials = await Material.find({ isShipped: false });
        res.json(materials);
    } catch (error) {
        next(error);
    }
});

// Search functionality
app.get('/materials/search', async (req, res, next) => {
    const { name, vessel } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (vessel) query.vessel = new RegExp(vessel, 'i');

    try {
        const materials = await Material.find(query);
        res.json(materials);
    } catch (error) {
        next(error);
    }
});

// Update material
app.put('/materials/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedMaterial) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.json({ message: 'Material updated successfully', updatedMaterial });
    } catch (error) {
        next(error); 
    }
});

// Mark item as shipped
app.post('/materials/:id/ship', async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }
        material.isShipped = true;
        material.dateShipped = new Date(); 
        await material.save();
        res.json({ message: 'Item marked as shipped', material });
    } catch (error) {
        next(error);
    }
});

app.get('/shipped', async (req, res, next) => {
    try {
        const shippedMaterials = await Material.find({ isShipped: true });
        res.json(shippedMaterials);
    } catch (error) {
        next(error); 
    }
});

// Delete material
app.delete('/materials/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const deletedMaterial = await Material.findByIdAndDelete(id);
        if (!deletedMaterial) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        next(error); 
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error' 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
