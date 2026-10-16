require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = require('./backend/app');
const connectDB = require('./backend/config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } 
    catch (err) {
        console.error(`Error during server start: ${err.message}`);
        process.exit(1);
    }
};

startServer();