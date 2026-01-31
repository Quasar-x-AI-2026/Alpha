import SpaceRenter from "../model/SpaceRenter.model.js";
import SpaceProvider from "../model/SpaceProvider.model.js";
import RentDetail from "../model/RentDetails.model.js";

/**
 * LOGIN (Space Renter)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const renter = await SpaceRenter.findOne({ email, password });

    if (!renter) {
      return res.json({
        isSuccess: false,
        message: "Invalid email or password",
        data: {},
      });
    }

    res.json({
      isSuccess: true,
      message: "Login successfully",
      data: renter,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
      data: {},
    });
  }
};

/**
 * REGISTER (Space Renter)
 */
export const addUser = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await SpaceRenter.findOne({ email });
    if (exists) {
      return res.json({
        isSuccess: false,
        message: "duplicate_email",
      });
    }

    const renter = await SpaceRenter.create(req.body);

    res.json({
      isSuccess: true,
      message: "Account created successfully",
      data: renter,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
      data: {},
    });
  }
};

/**
 * GET NEARBY PARKING SPACES
 */
export const getMarker = async (req, res) => {
  try {
    const { latitude, longitude, from, to } = req.body;

    const providers = await SpaceProvider.find({
      status: 1,
      latitude: { $gte: latitude - 0.3, $lte: latitude + 0.3 },
      longitude: { $gte: longitude - 0.3, $lte: longitude + 0.3 },
    });

    const data = providers.map((p) => p.toObject());

    res.json({
      isSuccess: true,
      message: "Marker fetched",
      data,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
      data: [],
    });
  }
};

/**
 * BOOK PARKING SLOT
 */
export const bookTicket = async (req, res) => {
  try {
    const booking = await RentDetail.create(req.body);

    res.json({
      isSuccess: true,
      message: "Parking booked successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
      data: {},
    });
  }
};

/**
 * CURRENT BOOKINGS
 */
export const booked = async (req, res) => {
  try {
    const data = await RentDetail.find({
      renterId: req.body.renterId,
      to: { $gte: new Date() },
    }).populate("providerId");

    res.json({
      isSuccess: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      data: [],
    });
  }
};

/**
 * BOOKING HISTORY
 */
export const history = async (req, res) => {
  try {
    const data = await RentDetail.find({
      renterId: req.body.renterId,
      to: { $lt: new Date() },
    }).populate("providerId");

    res.json({
      isSuccess: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      data: [],
    });
  }
};
