/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import  "swiper/css/bundle"
import { Navigation } from "swiper/modules";
const Home = () => {
  SwiperCore.use([Navigation])
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  // console.log(saleListing)
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch("/api/listing/get/?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/listing/get/?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get/?type=sale&limit=4");
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);
  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease.
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          RealState is the best place to find your next perfect place to live.{" "}
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Let's get started
        </Link>
      </div>
      <Swiper navigation>
        {offerListing && offerListing.length>0 && offerListing.map((listing)=>(
          <SwiperSlide key={listing._id}>
            <div style={{background:`url(${listing.imageUrls[0]}) no-repeat center`,backgroundSize:'cover'}} className="h-[500px]"></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-col gap-8 my-10 mx-auto max-w-6xl">
          {
            offerListing && offerListing.length>0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-slate-600 text-2xl font-semibold">Recent Offers.</h2>
                  <Link className="text-blue-800 text-sm hover:underline" to={`/search/?offer=true`}>Show more offers</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    offerListing.map((listing)=>(
                      <ListingCard listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            rentListing && rentListing.length>0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-slate-600 text-2xl font-semibold">Recent Places For Rents.</h2>
                  <Link className="text-blue-800 text-sm hover:underline" to={`/search/?type=rent`}>Show more places for rents</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    rentListing.map((listing)=>(
                      <ListingCard listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            saleListing && saleListing.length>0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-slate-600 text-2xl font-semibold">Recent Places For Sales.</h2>
                  <Link className="text-blue-800 text-sm hover:underline" to={`/search/?type=sale`}>Show more places for sales</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    saleListing.map((listing)=>(
                      <ListingCard listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          
      </div>
    </div>
  );
};

export default Home;
