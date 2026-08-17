import { useState } from "react";

import api from "../../../services/api";


const AddUserForm = ({ onSuccess }) => {

    const [formData, setFormData] = useState({

        role: "USER",
        name: "",
        email: "",
        address: "",
        password: ""
    });


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});

    const [loading, setLoading] = useState(false);


    const validateForm = () => {

        const nextErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!formData.role) {
            nextErrors.role = "Please select a role.";
        }

        if (!formData.name.trim()) {
            nextErrors.name = "Name is required.";
        } else if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
            nextErrors.name = "Name must be 20-60 characters.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formData.address.trim()) {
            nextErrors.address = "Address is required.";
        } else if (formData.address.trim().length > 400) {
            nextErrors.address = "Address cannot exceed 400 characters.";
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
        } else if (!passwordRegex.test(formData.password)) {
            nextErrors.password = "Password must be 8-16 characters with 1 uppercase and 1 special character.";
        }

        return nextErrors;

    };


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


            const response = await api.post( "/admin/users", payload, { headers: { Authorization: `Bearer ${token}` } } );


            setMessage(
                response.data.message || "User created successfully"
            );


            setFormData({

                role: "USER",
                name: "",
                email: "",
                address: "",
                password: ""

            });

            setFieldErrors({});


            if (onSuccess) {
                onSuccess();
            }

        }

        catch (error) {

            console.error( "Add user error:", error );


            setError( error.response?.data?.message || "Failed to create user" );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">

                Add New User

            </h2>


            {message && ( <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-green-700"> {message} </p> )}


            {error && ( <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700"> {error} </p> )}


            <form onSubmit={handleSubmit} className=" flex flex-col gap-5 " noValidate >


                {/* Role */}

                <div className="flex flex-col">

                    <label htmlFor="role" className=" text-sm font-medium text-gray-700 mb-2 " > Role </label>

                    <select id="role" name="role" value={formData.role} onChange={handleChange} className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 " >

                        <option value="USER">
                            User
                        </option>

                        <option value="STORE_OWNER">
                            Store Owner
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>

                    {fieldErrors.role && ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.role} </p> )}

                </div>



                {/* Name */}

                <div className="flex flex-col">

                    <label htmlFor="name" className=" text-sm font-medium text-gray-700 mb-2 " > Name </label>

                    <input id="name" name="name" type="text" minLength="20" maxLength="60" value={formData.name} onChange={handleChange} placeholder="Enter name" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.name ? ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.name} </p> ) : ( <p className=" mt-1 text-xs text-gray-500 "> 20-60 characters </p> )}

                </div>



                {/* Email */}

                <div className="flex flex-col">

                    <label htmlFor="email" className=" text-sm font-medium text-gray-700 mb-2 " > Email </label>

                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.email && ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.email} </p> )}

                </div>



                {/* Address */}

                <div className="flex flex-col">

                    <label htmlFor="address" className=" text-sm font-medium text-gray-700 mb-2 " > Address </label>

                    <textarea id="address" name="address" rows="4" maxLength="400" value={formData.address} onChange={handleChange} placeholder="Enter address" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-y focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.address ? ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.address} </p> ) : ( <p className=" mt-1 text-xs text-gray-500 "> Maximum 400 characters </p> )}
                </div>



                {/* Password */}

                <div className="flex flex-col">
                        <label htmlFor="password" className=" text-sm font-medium text-gray-700 mb-2 " > Password </label>


                    <input id="password" name="password" type="password" minLength="8" maxLength="16" value={formData.password} onChange={handleChange} placeholder="Enter password" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                    {fieldErrors.password ? ( <p className=" mt-1 text-xs text-red-600 "> {fieldErrors.password} </p> ) : ( <p className=" mt-1 text-xs text-gray-500 "> 8-16 characters, 1 uppercase, 1 special character </p> )}
                
                </div>



                {/* Submit Button */}

                <div className="pt-2">

                    <button type="submit" className=" w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition " >
                        {loading ? "Adding..." : "Add User"}
                    </button>

                </div>


            </form>

        </div>

    );

};


export default AddUserForm;
