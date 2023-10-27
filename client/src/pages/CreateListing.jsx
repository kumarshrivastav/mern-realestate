import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const CreateListing = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const handleImageSubmit = () => {
    if (images.length > 0 && images.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setImageUploadError(false);
          setUploading(false);
          //eslint-disable-next-line
        })
        //eslint-disable-next-line
        .catch((error) => {
          setImageUploadError("Image upload failed (2mb max per image");
        });
    } else {
      setUploading(false);
      setImageUploadError("you can only upload 6 image for listing");
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadtTask = uploadBytesResumable(storageRef, file);
      uploadtTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading completing is ${progress}`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadtTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="name"
            className="border p-3 rounded-lg"
            maxLength={64}
            minLength={10}
            required
          />
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="description"
            className="border p-3 rounded-lg"
            maxLength={64}
            minLength={10}
            required
          />
          <input
            type="text"
            name="address"
            id="address"
            placeholder="address"
            className="border p-3 rounded-lg"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox"  name="sale" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                name="bathrooms"
                id="bathrooms"
                defaultValue={1}
                max={5}
                min={1}
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                name="bedrooms"
                id="bedrooms"
                defaultValue={2}
                max={10}
                min={1}
                required
              />
              <span>Bedrooms</span>
            </div>
            <div>
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                name="regularPrice"
                id="regularPrice"
                max={5}
                defaultValue={80}
                min={1}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div>
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                name="discountedPrice"
                id="bathrooms"
                defaultValue={100}
                
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold my-3">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 rounded border border-gray-300 w-full"
              type="file"
              disabled={uploading}
              onChange={(e) => setImages(e.target.files)}
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 border border-green-700 uppercase text-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : " Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="p-3 flex justify-between items-center">
                <img
                  src={url}
                  alt="listing-image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 uppercase rounded-lg hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 text-white bg-slate-700 uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
