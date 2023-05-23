const express = require('express');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forgot', require('./routes/forgot'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reset', require('./routes/resetPassword'));
app.use('/api/updatepassword', require('./routes/updatePassword'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/products', require('./routes/products'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/fees', require('./routes/fees'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));