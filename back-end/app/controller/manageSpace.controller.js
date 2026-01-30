import SpaceProvider from "../model/SpaceProvider.model.js";
import RentDetail from "../model/RentDetails.model.js";

/**
 * LOGIN (Space Provider)
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const provider = await SpaceProvider.findOne({ email, password });

  if (!provider) {
    return res.json({
      isSuccess: false,
      message: "Invalid email or password",
      data: {},
    });
  }

  res.json({
    isSuccess: true,
    message: "Login successfully",
    data: provider,
  });
};

/**
 * ADD / EDIT SPACE PROVIDER
 */
export const addUser = async (req, res) => {
  const {
    edit,
    providerId,
    email,
    fileUrls,
  } = req.body;

  // Edit case (delete old provider & recreate)
  if (edit && providerId) {
    await SpaceProvider.findByIdAndDelete(providerId);
  }

  // Check duplicate email
  const existingUser = await SpaceProvider.findOne({ email });
  if (existingUser) {
    return res.json({
      isSuccess: false,
      message: "duplicate_email",
    });
  }

  const provider = await SpaceProvider.create({
    ...req.body,
    phoneNo: Number(req.body.phoneNo),
    maxSpace: Number(req.body.maxSpace),
    ratePerHour: Number(req.body.ratePerHour),
    fileUrls: fileUrls || [],
    status: 0,
  });

  res.json({
    isSuccess: true,
    message: "Account created successfully",
    data: provider,
  });
};

/**
 * RENT DETAILS FOR PROVIDER
 */
export const rentDetails = async (req, res) => {
  const { providerId } = req.body;

  const rentData = await RentDetail.find({ providerId })
    .populate("renterId", "userName email phoneNo");

  if (!rentData.length) {
    return res.json({
      isSuccess: false,
      message: "No rent details found",
      data: [],
    });
  }

  res.json({
    isSuccess: true,
    message: "Rent details fetched",
    data: rentData,
  });
};
