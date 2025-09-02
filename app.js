const express = require("express");
const app =express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");
const userRoutes = require("./routes/user");
const Books = require("./routes/book")
const Favourite =require("./routes/favourite");
const cart =require("./routes/cart");
const order =require("./routes/order");


app.use(cors());
app.use(express.json());

//routes

app.use("/api/v1",userRoutes);
app.use("/api/v1",Books);
app.use("/api/v1",Favourite);
app.use("/api/v1",cart);
app.use("/api/v1",order);
//creating port
app.listen(process.env.PORT,()=>{
console.log(`Server Started at port ${process.env.PORT}`);

    
});
