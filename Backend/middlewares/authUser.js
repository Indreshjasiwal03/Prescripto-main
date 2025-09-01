import jwt from "jsonwebtoken";

//user authentication middleware

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    req.body.userId = token_decode.id; // Add userId to req.body


    next();
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
