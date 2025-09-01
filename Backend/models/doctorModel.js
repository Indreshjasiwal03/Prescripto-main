import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true  },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

//minimize false allows to add empty object {} in schema

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema); 
  // mongoose.models is an object that contains all the models that have been registered with Mongoose in the current connection.
  // When you define a model using mongoose.model('ModelName', schema), Mongoose adds that model to the mongoose.models object.
  // This allows you to check if a model has already been defined before attempting to define it again, which can prevent errors in 
  // environments where the code might be executed multiple times, such as in serverless functions or during hot-reloading in development. 

export default doctorModel;
