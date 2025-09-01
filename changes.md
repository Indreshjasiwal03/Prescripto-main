# Summary of Changes

This file summarizes the changes made to the codebase.

## 1. Fixed redirection and user state after registration

**File:** `Frontend/src/pages/Login.jsx`

**Issue:** After registration, the user was not redirected to the homepage, and the login form was not cleared.

**Changes:**

**Previous Code:**
```javascript
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/login");
    }
  }, [token]);
```

**New Code:**
```javascript
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account Created Successfully");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };
```

## 2. Fixed user data loading in AppContext

**File:** `Frontend/src/context/AppContext.jsx`

**Issue:** The user's data was not being loaded correctly into the `AppContext`, so the user's name was not appearing in the navbar.

**Changes:**

**Previous Code:**
```javascript
        setUserData(data.user);
```

**New Code:**
```javascript
        setUserData(data.userData);
```

## 3. Added logging to the backend registration function

**File:** `Backend/controllers/userController.js`

**Issue:** The user was reporting a 409 error on registration, but the data was being saved.

**Changes:**

**Previous Code:**
```javascript
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    //check user existed
    const existedUser = await userModel.findOne({ email });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User with email already exists",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log("error:", error);

    return res.json({ success: false, message: error.message });
  }
};
```

**New Code:**
```javascript
const registerUser = async (req, res) => {
  console.log("Entering registerUser function");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("Missing detail");
      return res.json({ success: false, message: "Missing Detail" });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      console.log("Invalid email");
      return res.json({ success: false, message: "Enter a valid email" });
    }

    //validating strong password
    if (password.length < 8) {
      console.log("Password too short");
      return res.json({ success: false, message: "Enter a strong password" });
    }

    //check user existed
    console.log(`Checking for existing user with email: ${email}`);
    const existedUser = await userModel.findOne({ email });

    if (existedUser) {
      console.log("User with email already exists");
      return res.status(409).json({
        success: false,
        message: "User with email already exists",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    console.log("Saving new user");
    const newUser = new userModel(userData);

    const user = await newUser.save();
    console.log("New user saved");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    console.log("Exiting registerUser function with success");
    res.json({ success: true, token });
  } catch (error) {
    console.log("error:", error);

    return res.json({ success: false, message: error.message });
  }
};
```

## 4. Handled unauthorized appointment booking

**Files:**
- `Backend/controllers/userController.js`
- `Frontend/src/pages/Appointment.jsx`

**Issue:** When a user who was not logged in tried to book an appointment, they would see a generic error message.

**Changes:**

**`Backend/controllers/userController.js`:**
- Added a check to the `bookAppointment` function to see if a `userId` is present in the request.
- If the `userId` is not present, the backend now sends a 401 Unauthorized status with the message "Please login to book appointment".

**`Frontend/src/pages/Appointment.jsx`:**
- The `catch` block in the `bookAppointment` function now checks for a 401 status code in the error response.
- If a 401 status code is present, it displays a toast message "Please login to book appointment" and redirects the user to the login page.

## 5. Added dynamic Admin/Doctor Panel button to Navbar

**File:** `Frontend/src/components/Navbar.jsx`

**Issue:** The user wanted a single button in the navbar that would cycle through "Admin Panel" and "Doctor Panel" and redirect to the admin panel on click.

**Changes:**
- Added a new state variable `panelName` to hold the current panel name.
- Used `useEffect` to set up a timer that toggles the `panelName` every 3 seconds.
- Added a new button to the navbar that displays the `panelName`.
- Clicking the button redirects the user to `http://localhost:5173`.

## 6. Styled the Admin/Doctor Panel button

**File:** `Frontend/src/components/Navbar.jsx`

**Issue:** The Admin/Doctor Panel button was not styled and the transition between the two names was not smooth.

**Changes:**
- Added `px-8 py-3 rounded-full font-light border border-gray-400` classes to the button to give it a similar style to the "Create Account" button.
- Added a `key` prop to the button to force a re-render when the panel name changes.
- Added `transition-all` and `duration-300` classes to the button to make the transition between the two names smoother.

## 7. Fixed Razorpay payment verification

**Files:**
- `Backend/controllers/userController.js`
- `Backend/models/appointmentModel.js`

**Issue:** After a successful Razorpay payment, the payment status was not being updated in the database.

**Changes:**

**`Backend/controllers/userController.js`:**
- Imported the `crypto` module.
- Corrected the `verifyRazorpay` function to properly verify the Razorpay signature and update the appointment with payment details.

**`Backend/models/appointmentModel.js`:**
- Added a `paymentDetails` field to the `appointmentSchema` to store the Razorpay payment information.