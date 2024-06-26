const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));// Giới hạn kích thước payload URL-encoded lên 50MB
app.use(cookieParser());

// Áp dụng các routes vào ứng dụng Express
routes(app);

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Khởi động server và lắng nghe các kết nối trên cổng được chỉ định
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
