// import React from 'react'
import {useSelector} from "react-redux"
const Profile = () => {
  const {currentUser} =useSelector((state)=>state.user)
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl my-7 text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <img className="rounded-full h-24 w-24 object-cover mt-2 cursor-pointer self-center" src={currentUser?.avatar} alt="profile-picture" />
        <input type="text" name="username" id="username" placeholder="username" className="border p-3 rounded-lg" />
        <input type="email" name="email" id="email" placeholder="email" className="border p-3 rounded-lg" />
        <input type="password" name="password" id="password" placeholder="password" className="border p-3 rounded-lg" />
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80 uppercase">Update</button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile