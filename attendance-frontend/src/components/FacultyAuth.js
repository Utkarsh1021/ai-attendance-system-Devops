import React,
{
    useState
}
from "react";

import FacultyLogin
from "./FacultyLogin";

import FacultyRegister
from "./FacultyRegister";

const FacultyAuth = () => {

    // =========================
    // AUTH MODE
    // =========================

    const [isLogin,
        setIsLogin] =
        useState(true);

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            {/* =========================
                TOGGLE BUTTONS
            ========================= */}

            <button

                onClick={() =>

                    setIsLogin(
                        true
                    )
                }
            >

                Login

            </button>

            <button

                onClick={() =>

                    setIsLogin(
                        false
                    )
                }

                style={{
                    marginLeft: "20px"
                }}
            >

                Register

            </button>

            <hr />

            {/* =========================
                AUTH PAGES
            ========================= */}

            {

                isLogin

                    ?

                    <FacultyLogin />

                    :

                    <FacultyRegister />
            }

        </div>
    );
};

export default FacultyAuth;