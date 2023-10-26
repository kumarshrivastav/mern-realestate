// import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import { signInSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast"
const OAuth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleGoogleClick = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
          const result = await signInWithPopup(auth, provider);
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            }),
          });
          const data=await res.json()
          dispatch(signInSuccess(data))
          // console.log(data);
          navigate("/")
          return toast.success('you signin successfully')
        } catch (error) {
          console.log("could not continue with google", error);
          return toast.error('could not continue with google')
        }
      };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 p-3 rounded-lg uppercase text-white hover:opacity-80"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
