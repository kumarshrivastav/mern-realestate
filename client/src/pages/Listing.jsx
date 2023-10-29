import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Swiper,SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"
const Listing = () => {
    SwiperCore.use([Navigation])
  const params = useParams();
//   console.log(params)
  const [listing, setListing] = useState(null);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  //eslint-disable-next-line
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log(params)
    async function fetchListing() {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
            setError(true)
            setLoading(false)
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    }
    if(params.id){
        fetchListing();
    }
    
    // console.log(listing)
    //eslint-disable-next-line
  }, []);
  return <main>
    {loading && <p className="mt-7 text-2xl text-center">Loading....</p>}
    {error && <p className="mt-7 text-2xl text-center">Something went wrong....</p>}
    {listing && !loading && !error && <>
    <Swiper navigation>
        {
            listing?.imageUrls?.map((url)=>(
                <SwiperSlide key={url}>
                    <img src={url}  className="h-[550px]">
                    </img>
                </SwiperSlide>
            ))
        }
    </Swiper>
    </>}
  </main>;
};

export default Listing;
