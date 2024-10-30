# Inventory Management System

## Overview

The Inventory Management System is a web application designed to streamline the management of materials in transit and shipped items. It provides users with functionalities to log, edit, mark items as shipped, and view shipped items, enhancing inventory tracking and management.

## Features

- **Material Logging**: Add new materials with essential details such as name, quantity, description, vessel, and date logged.
- **Edit Materials**: Update details of existing materials in the inventory.
- **Mark as Shipped**: Move materials from the transit inventory to the shipped items list, marking them as shipped with a timestamp.
- **View Shipped Items**: Display a list of all shipped items with relevant details.
- **Search Functionality**: Quickly search for materials based on name or vessel.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Styling**: CSS
- **Email Notifications**: Nodemailer (for reminders)

## Installation

1. **Clone the repository**:

   git clone https://github.com/Jayminai/-InventoryApp.git
   cd InventoryApp```

2. **Install dependencies:**

Navigate to both the frontend and backend directories to install required dependencies.

For the backend:

    cd backend
    npm install

For the frontend:

    cd ../frontend
    npm install

## Set up environment variables:

Create a .env file in the backend directory and add your MongoDB URI and email credentials:

plaintext

MONGO_URI=your_mongodb_uri
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

## Run the application:

Start the backend server:

    cd backend
    node server.js

Start the frontend application:

    cd ../frontend
    npm start

Your application should now be running at http://localhost:3000.