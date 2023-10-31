import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Search = () => {
    const [loading,setLoading]=useState(false)
    const [listings,setListings]=useState([])
  const [sideBardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  console.log(listings)
  const navigate = useNavigate();
  // console.log(sideBardata)
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sideBardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sideBardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sideBardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sideBardata, order, sort });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBardata.searchTerm);
    urlParams.set("type", sideBardata.type);
    urlParams.set("furnished", sideBardata.furnished);
    urlParams.set("parking", sideBardata.parking);
    urlParams.set("offer", sideBardata.offer);
    urlParams.set("sort", sideBardata.sort);
    urlParams.set("order", sideBardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const furnishedFromUrl = urlParams.get("furnished");
    const parkingFromUrl = urlParams.get("parking");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      furnishedFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        ...sideBardata,
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl,
        furnished: furnishedFromUrl==='true'?true:false,
        parking: parkingFromUrl ==='true'?true:false,
        offer: offerFromUrl==='true'?true:false,
        sort: sortFromUrl || 'createAt',
        order: orderFromUrl || 'desc'
      });
    }
    const fetchListings=async()=>{
try {
    setLoading(true)
    const searchQuery=urlParams.toString()
    const res=await fetch(`/api/listing/get/?${searchQuery}`)
    const data=await res.json()
    setListings(data)
    setLoading(false)
} catch (error) {
    console.log(error)
}
    }
    fetchListings()
    //eslint-disable-next-line
  },[location.search]);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="searchTerm"
            >
              SearchTerm:
            </label>
            <input
              className="border rounded-lg p-3 w-full"
              value={sideBardata.searchTerm}
              onChange={handleChange}
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Search..."
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="all"
                checked={sideBardata.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={sideBardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={sideBardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={sideBardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">
              Amenities:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={sideBardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={sideBardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold" htmlFor="sort_order">
              Sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue="created_at_desc"
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price Low to High</option>
              <option value="regularPrice_asc">Price High to Low</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl border-b p-3 text-slate-700 font-semibold mt-5">
          Listing Results:{" "}
        </h1>
        {loading&&"Loading.."}
      </div>
    </div>
  );
};

export default Search;
