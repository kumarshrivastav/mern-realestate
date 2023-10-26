// import React from 'react'
import {useSelector} from "react-redux"
import {Navigate,Outlet} from "react-router-dom"
const PrivateRoute = () => {
    const {currentUser}=useSelector((state)=>state.user)
    // console.log(currentUser)
  return  currentUser?.username ? <Outlet/>:<Navigate to="/sign-in"/>
}

export default PrivateRoute