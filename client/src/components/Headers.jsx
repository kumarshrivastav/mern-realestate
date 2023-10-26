// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import {useSelector} from "react-redux"
const Headers = () => {
  const {currentUser}=useSelector((state)=>state.user)
  // console.log(currentUser)
  // const profilePicture=currentUser?.avatar
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Real</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        </Link>
        
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            name="search"
            id="search"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            Home
          </li></Link>
          <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            About
          </li></Link>
          
          {currentUser?.username? (
            <Link to="profile">
            <img className="rounded-full h-7 w-7 object-cover" src={currentUser?.avatar} alt="profile" />
          </Link>
          ):(
            <Link to="sign-in">
            <li className="sm:inline text-slate-700 hover:underline">
            SignIn
          </li>
          </Link>
          )}
         
        </ul>
      </div>
    </header>
  );
};

export default Headers;
