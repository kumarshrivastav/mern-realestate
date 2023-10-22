// import React from 'react'
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Profile = () => {
  const fileRef = useRef();
  const [filePercentage, setFilePercentage] = useState(0);
  const [file, setFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  //eslint-disable-next-line
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(filePercentage);
  console.log(formData);
  // firebase
  // allow read;
  // allow  write: if
  // request.resource.size <2 *1024*1024 && request.resource.contentType.matches('image/.*')
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
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl my-7 text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
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
          className="border outline-none p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          className="border outline-none p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="border outline-none p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80 uppercase">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
