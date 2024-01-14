import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    dob:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    adhaarNumber:{
        type:String,
        require:true
    }

},
{timestamps : true}
);

export default mongoose.model("UserData", UserDataSchema);