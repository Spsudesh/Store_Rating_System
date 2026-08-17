import { useEffect, useState } from "react";

import api from "../../../services/api";


const AddStoreForm = ({ onSuccess }) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [owners, setOwners] = useState([]);

    const [ownerLoading, setOwnerLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});


    const validateForm = () => {

        const nextErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            nextErrors.name = "Store name is required.";
        } else if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
            nextErrors.name = "Store name must be 20-60 characters.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Store email is required.";
        } else if (!emailRegex.test(formData.email.trim())) {
            nextErrors.email = "Enter a valid store email address.";
        }

        if (!formData.address.trim()) {
            nextErrors.address = "Store address is required.";
        } else if (formData.address.trim().length > 400) {
            nextErrors.address = "Store address cannot exceed 400 characters.";
        }

        if (!formData.owner_id) {
            nextErrors.owner_id = "Please select a store owner.";
        }

        return nextErrors;

    };


    const fetchOwners = async () => {

        setOwnerLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await api.get( "/admin/users",
                {
                    params: {
                        role: "STORE_OWNER"
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOwners((response.data.users || []).filter((owner) => Number(owner.total_stores || 0) === 0));

        }

        catch (error) {

            console.error( "Get owners error:", error );

            setError( error.response?.data?.message || "Failed to load store owners" );

        }

        finally {

            setOwnerLoading(false);

        }

    };


    useEffect(() => {

        fetchOwners();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setError("");

        const validationErrors = validateForm();

        setFieldErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);


        try {

            const token = localStorage.getItem("token");


            const payload = {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim()
            };


            const response = await api.post( "/admin/stores", payload, { headers: { Authorization: `Bearer ${token}` } } );

            setMessage(
                response.data.message || "Store created successfully"
            );


            setFormData({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            setFieldErrors({});


            if (onSuccess) {
                onSuccess();
            }

        }

        catch (error) {

            console.error( "Add store error:", error );

           setError( error.response?.data?.message || "Failed to create store" );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Add New Store
            </h2>

            {message && ( <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-green-700"> {message} </p> )}

            {error && ( <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700"> {error} </p> )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate >


                {/* Store Name */}
                <div className="flex flex-col">
                    <label className=" text-sm font-medium text-gray-700 mb-2 " > Store Name </label>

                    <input type="text" name="name" minLength="20" maxLength="60" value={formData.name} onChange={handleChange} placeholder="Enter store name"
                     className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.name ? ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.name} </p> ) : ( <p className=" mt-1 text-xs text-gray-500 "> 20-60 characters </p> )}

                </div>



                {/* Store Email */}
                <div className="flex flex-col">

                    <label className=" text-sm font-medium text-gray-700 mb-2 " > Store Email </label>

                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter store email" 
                    className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.email && ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.email} </p> )}
                </div>



                {/* Address */}

                    <div className="flex flex-col">

                    <label className=" text-sm font-medium text-gray-700 mb-2 " > Store Address </label>

                    <textarea rows="3" name="address" maxLength="400" value={formData.address} onChange={handleChange} placeholder="Enter store address" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 " ></textarea>

                    {fieldErrors.address ? ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.address} </p> ) : ( <p className=" mt-1 text-xs text-gray-500 "> Maximum 400 characters </p> )}

                </div>



                {/* Owner */}

                <div className="flex flex-col">

                    <label className=" text-sm font-medium text-gray-700 mb-2 " > Store Owner </label>

                    <select name="owner_id" value={formData.owner_id} onChange={handleChange} className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 " >

                        <option value="">
                            {ownerLoading ? "Loading owners..." : "Select store owner"}
                        </option>

                        {owners.map((owner) => (

                            <option key={owner.id} value={owner.id}>
                                {owner.name} ({owner.email})
                            </option>

                        ))}

                    </select>

                    {!ownerLoading && owners.length === 0 && ( <p className=" mt-1 text-xs text-gray-500 "> No store owner available. Create a new store owner first. </p> )}

                    {fieldErrors.owner_id && ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.owner_id} </p> )}

                </div>



                {/* Submit */}

                <div className="pt-2">

                    <button type="submit" className=" px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition " > {loading ? "Adding..." : "Add Store"} </button>

                </div>

            </form>

        </div>

    );

};


export default AddStoreForm;
