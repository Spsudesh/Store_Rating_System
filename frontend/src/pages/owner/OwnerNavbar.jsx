import { Link } from "react-router-dom";


const OwnerNavbar = () => {
    return (
        <div className="bg-gray-900 text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
                <div>
                    <h1 className="text-xl font-bold">
                        Rating System
                    </h1>

                    <p className="text-sm text-gray-400">
                        Store Owner Panel
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/owner"
                        className="rounded px-4 py-2 hover:bg-gray-800"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/owner/ratings"
                        className="rounded px-4 py-2 hover:bg-gray-800"
                    >
                        Ratings
                    </Link>

                    <Link 
                    to="/owner/update_password"
                    className="rounded px-4 py-2 hover:bg-gray-800"> Update Password </Link>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                        className="rounded bg-red-600 px-4 py-2 hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerNavbar;
