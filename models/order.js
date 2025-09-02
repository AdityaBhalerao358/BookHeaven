const  mongoose =require("mongoose");
const order = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
    },
     book:{
        type:mongoose.Types.ObjectId,
        ref:"books",
    },
      status: {
  type: String,
  default: "order Placed",  // Default value as string
  enum: ["order Placed", "Out for delivery", "Delivered", "Canceled"] // Correct enum format
}

},{timestamps:true}
);
module.exports=mongoose.model("order",order);