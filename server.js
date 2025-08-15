const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./confiq/db");
const userRoute = require("./routes/userRoute");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/users", userRoute);
// app.use("/api/products", require("./routes/productRoute"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Error handling middleware
// app.use(errorMiddleware);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
