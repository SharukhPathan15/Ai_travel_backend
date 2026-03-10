import asyncHandler from "../utils/asyncHandler.js";
import Trip from "../models/trip.model.js";
import { generateTripPlan } from "../services/ai.service.js";

export const generateAITrip = asyncHandler(async (req, res) => {

  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user.userId
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const aiResult = await generateTripPlan({
    destination: trip.destination,
    days: trip.days,
    budgetType: trip.budgetType,
    interests: trip.interests
  });

  trip.itinerary = aiResult.itinerary;
  trip.budgetEstimate = aiResult.budgetEstimate;
  trip.hotels = aiResult.hotels;

  await trip.save();

  res.json({
    success: true,
    data: trip
  });

});

