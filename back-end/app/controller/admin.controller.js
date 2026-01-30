import Admin from "../model/Admin.model.js";
import SpaceProvider from "../model/SpaceProvider.model.js";

/**
 * Admin Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin credentials
    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.json({
        isSuccess: false,
        message: "Invalid email or password",
        data: {},
      });
    }

    // Fetch pending space providers (status = 0)
    const data = await SpaceProvider.find({ status: 0 });

    res.json({
      isSuccess: true,
      message: "Login successfully",
      data,
    });
  } catch (error) {
    res.json({
      isSuccess: false,
      message: "Server error",
      data: {},
    });
  }
};

/**
 * Change Space Provider Status
 */
export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const result = await SpaceProvider.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (result) {
      res.json({
        isSuccess: true,
        message: "Status changed successfully",
        data: {},
      });
    } else {
      res.json({
        isSuccess: false,
        message: "Something went wrong",
        data: {},
      });
    }
  } catch (error) {
    res.json({
      isSuccess: false,
      message: "Server error",
      data: {},
    });
  }
};
