const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./confiq/db");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const inventoryRoutes = require("./routes/inventoryRoute");
const orderRoute = require("./routes/orderRoute");
const analyticRoutes = require("./routes/analyticRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/analytics", analyticRoutes);

// Error handling middleware
// app.use(errorMiddleware);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
