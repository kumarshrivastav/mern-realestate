// import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {Link} from "react-router-dom"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
const Profile = () => {
  const fileRef = useRef();
  const [filePercentage, setFilePercentage] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [showListingError,setShowListingError]=useState(false)
  const [userListing,setUserListing]=useState([])
  const { currentUser, loading, error } = useSelector((state) => state.user);
  //eslint-disable-next-line
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(userListing)
  const dispatch = useDispatch();
  // console.log(userListing)
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      //eslint-disable-next-line
      (error) => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    //eslint-disable-next-line
  }, [file]);
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleDeleteUser=async()=>{
try {
  dispatch(deleteUserStart())
  const res=await fetch(`/api/user/delete/${currentUser._id}`,{
    method:'DELETE'
  })
  const data=await res.json()
  if(data.success===false){
    return dispatch(deleteUserFailure(data.message))
  }
 dispatch(deleteUserSuccess(data))
 localStorage.clear()
 return

} catch (error) {
  return dispatch(deleteUserFailure(error.message))
}
  }
  const handleSignoutUser=async()=>{
try {
  dispatch(signoutUserStart())
  const res=await fetch("/api/auth/signout")
  const data=await res.json()
  if(data.success===false){
    dispatch(signoutUserFailure(data.message))
    return
  }
  dispatch(signoutUserSuccess(data))

} catch (error) {
  dispatch(signoutUserFailure(error.message))
}
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleShowListing=async()=>{
try {
  const res=await fetch(`/api/user/listings/${currentUser._id}`)
  const data=await res.json()
  if(data.success===false){
    return setShowListingError(true)
  }
  setShowListingError(false)
  setUserListing(data)
} catch (error) {
  setShowListingError(true)
}
  }
  const handleDeleteListing=async(listingId)=>{
    try {
      const res=await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE'
      })
      //eslint-disable-next-line
      const data=await res.json()
      setUserListing((prev)=>{
        prev.filter((listing)=>listing._id!==listingId)
      })
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl my-7 text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover mt-2 cursor-pointer self-center"
          src={formData?.avatar || currentUser?.avatar}
          alt="profile-picture"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}`}</span>
          ) : (
            filePercentage === 100 && (
              <span className="text-green-700">
                Image Successfully Uploaded
              </span>
            )
          )}
        </p>

        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleFormData}
          className="border outline-none p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleFormData}
          className="border outline-none p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          // value={updateUser.password}
          onChange={handleFormData}
          placeholder="password"
          className="border outline-none p-3 rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 uppercase disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link to="/create-listing" className="bg-green-700 text-white p-3 rounded-lg hover:opacity-90 uppercase text-center">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-3">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignoutUser} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User Updated Successfully ...." : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListing}>Show Listing</button>
      {showListingError && <p className="text-red-700 text-sm">Error In Show Listing</p>}
      {userListing && userListing.length>0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListing.map((listing)=>(
        <div key={listing._id} className="border p-3 rounded-lg flex justify-between items-center gap-4">
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing-image" className="h-16 w-16 object-contain" />
          </Link>
          <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
          <p>{listing.name}</p>
          </Link>
          <div className="flex flex-col items-center">
            <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
        </div>
      ))}
      </div>
          }
    </div>
  );
};

export default Profile;
