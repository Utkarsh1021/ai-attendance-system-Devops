import React,
{
    useState
}
from "react";

import axios from "axios";

import FacultySession
from "./FacultySession";

const FacultyLogin = () => {

    // =========================
    // STATES
    // =========================

    const [email,
        setEmail] =
        useState("");

    const [password,
        setPassword] =
        useState("");

    const [loggedIn,
        setLoggedIn] =
        useState(false);

    // =========================
    // LOGIN FACULTY
    // =========================

    const loginFaculty =
        async () => {

            try {

                const response =

                    await axios.post(

                        "http://localhost:8082/faculty/login",

                        {

                            email,

                            password
                        }
                    );

                console.log(
                    response.data
                );

                // =========================
                // INVALID CREDENTIALS
                // =========================

                if (

                    response.data ===
                    "Invalid Credentials"

                ) {

                    alert(
                        "Invalid Credentials"
                    );

                    return;
                }

                // =========================
                // STORE JWT TOKEN
                // =========================

                localStorage.setItem(

                    "facultyToken",

                    response.data
                );

                // =========================
                // LOGIN SUCCESS
                // =========================

                setLoggedIn(
                    true
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Login Failed"
                );
            }
        };

    // =========================
    // SHOW FACULTY DASHBOARD
    // =========================

    if (loggedIn) {

        return <FacultySession />;
    }

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>
                Faculty Login
            </h1>

            <input

                type="email"

                placeholder="Enter Email"

                value={email}

                onChange={(e) =>

                    setEmail(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input

                type="password"

                placeholder="Enter Password"

                value={password}

                onChange={(e) =>

                    setPassword(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button

                onClick={
                    loginFaculty
                }
            >

                Login

            </button>

        </div>
    );
};

export default FacultyLogin;