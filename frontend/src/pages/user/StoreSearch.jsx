const StoreSearch = ({ search, setSearch, onSearch, onClear }) => {

    const handleSubmit = (e) => {

        e.preventDefault();

        onSearch();

    };


    return (

        <form onSubmit={handleSubmit} className=" rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">

            <div className=" grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-end ">

                {/* Search */}
                <div className=" lg:col-span-8 ">

                    <label htmlFor="storeSearch" className=" mb-2 block text-sm font-semibold text-gray-800 "> Search Stores </label>

                    <input id="storeSearch" type="text" value={search} onChange={(e) => { setSearch(e.target.value); }}
                        placeholder="Search by store name or address" className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 "
                    />

                </div>


                <div className=" flex gap-3 lg:col-span-4 ">

                    <button type="submit" className=" flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 "> Search </button>

                    <button type="button" onClick={onClear} className=" rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 "> Clear </button>

                </div>

            </div>

        </form>

    );

};


export default StoreSearch;
