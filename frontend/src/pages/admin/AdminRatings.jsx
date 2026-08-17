import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminRatings = () => {

    const [ratings, setRatings] = useState([]);

    const [search, setSearch] = useState("");

    const [ratingFilter, setRatingFilter] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });


    const handleSort = (key) => {

        setSortConfig((previous) => ({
            key: key,
            direction: previous.key === key && previous.direction === "asc" ? "desc" : "asc"
        }));

    };


    const getSortIcon = (key) => {

        if (sortConfig.key !== key) {
            return "↕";
        }

        return sortConfig.direction === "asc" ? "↑" : "↓";

    };


    const sortedRatings = [...ratings].sort((a, b) => {

        if (!sortConfig.key) {
            return 0;
        }

        const firstValue = a[sortConfig.key] || "";
        const secondValue = b[sortConfig.key] || "";

        if (sortConfig.key === "id" || sortConfig.key === "rating") {
            return sortConfig.direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
        }

        return sortConfig.direction === "asc"
            ? String(firstValue).localeCompare(String(secondValue))
            : String(secondValue).localeCompare(String(firstValue));

    });


   //fetch raating
     const fetchRatings = async () => {

        setLoading(true);
        setError("");

        try {

            const token = localStorage.getItem("token");

            const response = await api.get( "/admin/ratings", 
                {
                    params: {
                        search: search.trim(),
                        rating: ratingFilter
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRatings(
                response.data.ratings || []
            );

        }

        catch (error) {

            console.error( "Fetch ratings error", error );

            setError( error.response?.data?.message || "Failed to fetch ratings" );
        }

        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchRatings();

    }, []);



    //search
    const handleSearch = (e) => {

        e.preventDefault();

        fetchRatings();

    };


    //clear filter
    const handleClear = () => {

        setSearch("");
        setRatingFilter("");

        setTimeout(() => { fetchRatings(); }, 0);

    };


    return (

        <div className=" min-h-screen bg-white px-6 py-8 sm:px-8 ">

            <div className=" mx-auto w-full max-w-6xl ">

                
                <div className="mb-8">

                    <h1 className=" text-3xl font-bold text-gray-900 "> Ratings </h1>
                    <p className=" mt-2 text-gray-600 "> Search and manage store ratings. </p>

                </div>



                <form onSubmit={handleSearch} className=" mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm " >

                    <div className=" flex flex-col gap-4 lg:flex-row lg:items-end ">

                           
                        <div className="flex-1">

                            <label htmlFor="search" className=" mb-2 block text-sm font-semibold text-gray-800 " > Search </label>

                            <input id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value) } placeholder="Search by user, store or address" 
                            className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " />

                        </div>


                        <div className=" w-full lg:w-52 ">

                            <label htmlFor="rating" className=" mb-2 block text-sm font-semibold text-gray-800 " > Rating </label>

                            <select id="rating" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value) } className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " >

                                <option value=""> All Ratings </option>

                                <option value="5"> 5 </option>

                                <option value="4"> 4 </option>

                                <option value="3"> 3 </option>

                                <option value="2"> 2 </option>

                                <option value="1"> 1 </option>

                            </select>

                        </div>


                        <button type="submit" disabled={loading} className=" w-full rounded-lg bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto " > {loading ? "Searching..." : "Search" } </button>



                        {/* CLEAR BUTTON */}

                        <button type="button" onClick={handleClear} className=" w-full rounded-lg border border-gray-300 bg-white px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50 lg:w-auto " > Clear </button>
                    </div>

                </form>



              
         
                {error && ( <div className=" mb-6 rounded-lg border border-red-200 bg-white px-5 py-4 text-red-600 "> {error} </div> )}



                
                <div className=" mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ">
                    <div className="overflow-x-auto">

                        <table className=" w-full min-w-[900px] table-fixed ">


                            <thead>

                                <tr className=" border-b border-gray-200 ">

                                    <th className=" w-[90px] px-5 py-5 text-left text-sm font-semibold text-gray-800 " > Sr No. </th>

                                    <th className=" w-[20%] px-5 py-5 text-left text-sm font-semibold text-gray-800 " >
                                        <button type="button" onClick={() => handleSort("user_name")} className=" flex items-center gap-2 font-semibold ">
                                            User <span>{getSortIcon("user_name")}</span>
                                        </button>
                                    </th>

                                    <th className=" w-[25%] px-5 py-5 text-left text-sm font-semibold text-gray-800 " >
                                        <button type="button" onClick={() => handleSort("store_name")} className=" flex items-center gap-2 font-semibold ">
                                            Store <span>{getSortIcon("store_name")}</span>
                                        </button>
                                    </th>

                                    <th className=" w-[30%] px-5 py-5 text-left text-sm font-semibold text-gray-800 " >
                                        <button type="button" onClick={() => handleSort("address")} className=" flex items-center gap-2 font-semibold ">
                                            Address <span>{getSortIcon("address")}</span>
                                        </button>
                                    </th>

                                        <th className=" w-[20%] px-5 py-5 text-left text-sm font-semibold text-gray-800 " >
                                            <button type="button" onClick={() => handleSort("rating")} className=" flex items-center gap-2 font-semibold ">
                                                Rating <span>{getSortIcon("rating")}</span>
                                            </button>
                                        </th>

                                </tr>

                            </thead>

                            <tbody>


                                {/* LOADING */}
                        {loading && ( <tr> <td colSpan="5" className=" px-6 py-12 text-center text-gray-500 " > Loading ratings... </td> </tr> )}

                                {/* NO RATINGS */}

                                {!loading && ratings.length === 0 && ( <tr> <td colSpan="5" className=" px-6 py-12 text-center text-gray-500 " > No ratings found. </td> </tr> ) }



                                {/* RATINGS */}

                                {!loading && ratings.length > 0 && sortedRatings.map( (rating, index) => ( <tr key={rating.id} className=" border-b border-gray-200 last:border-b-0 transition hover:bg-gray-50 " >


                                                <td className=" px-5 py-5 text-sm text-gray-700 "> {index + 1} </td>
                                              
                                                <td className=" px-5 py-5 text-sm font-medium text-gray-900 truncate "> {rating.user_name} </td>

                                                <td className=" px-5 py-5 text-sm text-gray-700 truncate "> {rating.store_name} </td>

                                                <td className=" px-5 py-5 text-sm text-gray-700 ">

                                                    <div className=" truncate max-w-[300px] " title={rating.address} > {rating.address} </div>

                                                </td>

                                                <td className=" px-5 py-5 text-sm font-semibold text-gray-900 ">
                                                    <span className=" inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-blue-700 "> {rating.rating} / 5 </span>
                                                </td>


                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AdminRatings;
