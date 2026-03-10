import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: String
  }
});

const itinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  activities: [activitySchema]
});

const budgetSchema = new mongoose.Schema({
  flights: Number,
  accommodation: Number,
  food: Number,
  activities: Number,
  total: Number
});

const hotelSchema = new mongoose.Schema({
  name: String,
  type: String,
  rating: Number
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    days: {
      type: Number,
      required: true
    },

    budgetType: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    interests: [String],

    itinerary: [itinerarySchema],

    budgetEstimate: budgetSchema,

    hotels: [hotelSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Trip", tripSchema);