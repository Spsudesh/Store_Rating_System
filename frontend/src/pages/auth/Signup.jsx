import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Signup = () => {
    const navigate = useNavigate();

    const [formdata, Setformdata] = useState({
        role: "",
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const validateForm = () => {
        const nextErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!formdata.role) {
            nextErrors.role = "Please select a role.";
        }

        if (!formdata.name.trim()) {
            nextErrors.name = "Name is required.";
        } else if (formdata.name.trim().length < 20 || formdata.name.trim().length > 60) {
            nextErrors.name = "Name must be 20-60 characters.";
        }

        if (!formdata.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!emailRegex.test(formdata.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formdata.address.trim()) {
            nextErrors.address = "Address is required.";
        } else if (formdata.address.trim().length > 400) {
            nextErrors.address = "Address cannot exceed 400 characters.";
        }

        if (!formdata.password) {
            nextErrors.password = "Password is required.";
        } else if (!passwordRegex.test(formdata.password)) {
            nextErrors.password = "Password must be 8-16 characters with 1 uppercase and 1 special character.";
        }

        return nextErrors;
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);
        setMessage("");

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const payload = {
                ...formdata,
                name: formdata.name.trim(),
                email: formdata.email.trim(),
                address: formdata.address.trim()
            };

            const response = await api.post("/signup", payload);
            setMessage(response.data.message || "User created successfully.");
            Setformdata({
                role: "",
                name: "",
                email: "",
                address: "",
                password: ""
            });
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.error(error);
            setErrors({
                form: error.response?.data?.message || "Unable to create account."
            });
        }
    };

    const inputClass = `
        w-full
        px-3
        py-3
        text-sm
        text-slate-800
        bg-slate-50
        border
        border-slate-300
        rounded-lg
        outline-none
    `;

    const errorClass = "mt-1 text-xs text-red-600";
    const hintClass = "mt-1 text-xs text-slate-500";

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-slate-50
            px-4
            py-10
        ">
            <div className="
                w-full
                max-w-lg
                bg-white
                rounded-xl
                shadow-sm
                border
                border-slate-200
                p-8
            ">
                <div className="mb-6">
                    <p className="
                        text-xs
                        font-semibold
                        tracking-widest
                        text-blue-700
                        uppercase
                        mb-2
                    ">
                        Store Management
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        text-slate-900
                        mb-2
                    ">
                        Create account
                    </h2>

                    <p className="text-sm text-slate-500">
                        Sign up to rate stores and manage your account.
                    </p>
                </div>

                <form onSubmit={handlesubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm text-slate-800 font-semibold mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            className={inputClass}
                            value={formdata.role}
                            onChange={(e) => Setformdata({ ...formdata, role: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            <option value="STORE_OWNER">Store Owner</option>
                            <option value="USER">User</option>
                        </select>
                        {errors.role && <p className={errorClass}>{errors.role}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm text-slate-800 font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={inputClass}
                            placeholder="Enter your full name"
                            minLength="20"
                            maxLength="60"
                            value={formdata.name}
                            onChange={(e) => Setformdata({ ...formdata, name: e.target.value })}
                        />
                        {errors.name ? (
                            <p className={errorClass}>{errors.name}</p>
                        ) : (
                            <p className={hintClass}>20-60 characters</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm text-slate-800 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={inputClass}
                            placeholder="Enter your email"
                            value={formdata.email}
                            onChange={(e) => Setformdata({ ...formdata, email: e.target.value })}
                        />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm text-slate-800 font-semibold mb-2">
                            Address
                        </label>
                        <textarea
                            id="address"
                            className={`${inputClass} min-h-24 resize-y`}
                            placeholder="Enter your address"
                            maxLength="400"
                            value={formdata.address}
                            onChange={(e) => Setformdata({ ...formdata, address: e.target.value })}
                        />
                        {errors.address ? (
                            <p className={errorClass}>{errors.address}</p>
                        ) : (
                            <p className={hintClass}>Maximum 400 characters</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm text-slate-800 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={inputClass}
                            placeholder="Enter your password"
                            minLength="8"
                            maxLength="16"
                            value={formdata.password}
                            onChange={(e) => Setformdata({ ...formdata, password: e.target.value })}
                        />
                        {errors.password ? (
                            <p className={errorClass}>{errors.password}</p>
                        ) : (
                            <p className={hintClass}>8-16 characters, 1 uppercase, 1 special character</p>
                        )}
                    </div>

                    {errors.form && <p className="mb-4 text-sm text-red-600">{errors.form}</p>}
                    {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

                    <button className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-semibold
                        py-3
                        rounded-lg
                        transition
                        duration-200
                    ">
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-5">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-700 font-semibold hover:text-blue-800">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
