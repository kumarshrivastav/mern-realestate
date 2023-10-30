// import React from 'react'

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form action="" className="flex flex-col gap-8">
                <div className="flex items-center gap-2" >
                    <label className="whitespace-nowrap font-semibold" htmlFor="searchTerm">SearchTerm:</label>
                    <input className="border rounded-lg p-3 w-full" type="text" name="searchTerm" id="searchTerm" placeholder="Search..." />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold" htmlFor="type">Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="all"  />
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="rent"  />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="sale"  />
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="offer"  />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold" htmlFor="type">Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="parking"  />
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="furnished"  />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold" htmlFor="sort_id">Sort:</label>
                    <select id="sort_id" className="border rounded-lg p-3">
                        <option>Price Low to High</option>
                        <option>Price High to Low</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">Search</button>
            </form>
        </div>
        <div>
            <h1 className="text-3xl border-b p-3 text-slate-700 font-semibold mt-5">Listing Results: </h1>
        </div>
    </div>
  )
}

export default Search