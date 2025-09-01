import jwt from "jsonwebtoken";

//admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next(); // If the token is valid and the user is authorized, this line calls the next middleware function in the stack.
    // This allows the request to proceed to the intended route handler or the next middleware.
    // If the token is invalid or the user is not authorized, the function returns a JSON response indicating that the user is not authorized,
    // and the request does not proceed further.  
    // This is a common pattern in Express.js applications for protecting routes that require authentication and authorization.
    // The next() function is crucial for maintaining the flow of request handling in middleware functions.
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
