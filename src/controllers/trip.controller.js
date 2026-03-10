import Trip from "../models/trip.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTrip = asyncHandler(async (req, res) => {

  const { destination, days, budgetType, interests } = req.body;

  const trip = await Trip.create({
    user: req.user.userId,
    destination,
    days,
    budgetType,
    interests
  });

  res.status(201).json({
    success: true,
    data: trip
  });

});

export const getTrips = asyncHandler(async (req, res) => {

  const trips = await Trip.find({
    user: req.user.userId
  });

  res.json({
    success: true,
    data: trips
  });

});

export const getTrip = asyncHandler(async (req, res) => {

  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user.userId
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: trip
  });

});

export const deleteTrip = asyncHandler(async (req, res) => {

  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: "Trip deleted"
  });

});