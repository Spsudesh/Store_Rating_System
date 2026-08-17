import { useState } from "react";


const StoreCard = ({ store, onRatingSubmit, onRatingUpdate }) => {

    const [rating, setRating] = useState(store.userRating || "");


    const handleSubmit = () => {

        if (!rating) {
            alert("Please select rating");
            return;
        }


        if (store.userRating) {

            onRatingUpdate(store.id, rating);

        } else {

            onRatingSubmit(store.id, rating);

        }

    };


    const overallRating = Number(store.overallRating || 0).toFixed(1);


    return (

        <div className=" flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 ">

            <div className=" flex-1 ">

                <div className=" flex items-start justify-between gap-5 ">

                    <div>
                        <h2 className=" text-lg font-semibold leading-7 text-gray-900 "> {store.name} </h2>

                        <p className=" mt-2 text-sm leading-6 text-gray-600 "> {store.address} </p>
                    </div>


                    <div className=" shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center ">
                        <p className=" text-xs font-semibold text-gray-500 "> Avg Rating </p>

                        <p className=" mt-1 text-lg font-bold text-gray-900 "> {overallRating} <span className=" text-yellow-500 ">★</span> </p>
                    </div>

                </div>


                <div className=" mt-5 border-t border-gray-100 pt-4 ">

                    <p className=" text-sm font-medium text-gray-700 ">
                        Your Rating:
                        <span className=" ml-2 font-semibold text-gray-900 ">
                            {store.userRating ? `${store.userRating} / 5` : "Not rated"}
                        </span>
                    </p>

                </div>

            </div>


            <div className=" mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center ">

                <select value={rating} onChange={(e) => { setRating(e.target.value); }} className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-36 ">
                    <option value="">Rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>


                <button type="button" onClick={handleSubmit} className=" w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto ">
                    {store.userRating ? "Update Rating" : "Submit Rating"}
                </button>

            </div>

        </div>

    );

};


export default StoreCard;
