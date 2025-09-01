/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "INR";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

      useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

// ### ✅ What is `props.children`?

// * In React, every component receives a special prop called **`children`**.
// * It represents **whatever you put inside the component’s opening and closing tags**.

// ---

// ### 🔎 Example 1: Without `props.children`

// ```jsx
// const Wrapper = () => {
//   return <div>I am a wrapper</div>;
// };

// <Wrapper />
// ```

// ➡️ Output:

// ```
// I am a wrapper
// ```

// Here, `Wrapper` doesn’t render anything inside it, just its own content.

// ---

// ### 🔎 Example 2: With `props.children`

// ```jsx
// const Wrapper = (props) => {
//   return <div>{props.children}</div>;
// };

// <Wrapper>
//   <h1>Hello World</h1>
//   <p>This is inside the wrapper</p>
// </Wrapper>
// ```

// ➡️ Output:

// ```
// Hello World
// This is inside the wrapper
// ```

// 👉 Here, `props.children` is:

// ```jsx
// [
//   <h1>Hello World</h1>,
//   <p>This is inside the wrapper</p>
// ]
// ```

// ---

// ### 🔎 Example 3: Context Provider Case

// ```jsx
// <AppContextProvider>
//   <DoctorsList />
// </AppContextProvider>
// ```

// * Inside `AppContextProvider`, `props.children` = `<DoctorsList />`.
// * That’s why when you return:

//   ```jsx
//   <AppContext.Provider value={value}>
//     {props.children}
//   </AppContext.Provider>
//   ```

//   it actually becomes:

//   ```jsx
//   <AppContext.Provider value={value}>
//     <DoctorsList />
//   </AppContext.Provider>
//   ```

// So now, `DoctorsList` (and anything else inside the provider) can access the `value` given to the context.

// ---

// ### 🔑 Summary

// * `props.children` = whatever you nest **between the component’s tags**.
// * It makes components flexible and reusable.
// * Context Providers use `props.children` so you can **wrap your entire app (or parts of it)** and still render them while providing context values.

// ---

// ⚡Quick analogy:
// Think of `props.children` as a **placeholder** in your component where you can drop in other components/content when you use it.