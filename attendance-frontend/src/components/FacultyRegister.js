import React,
{
    useState
}
from "react";

import axios from "axios";

import FacultyLogin
from "./FacultyLogin";

const FacultyRegister = () => {

    // =========================
    // STATES
    // =========================

    const [facultyId,
        setFacultyId] =
        useState("");

    const [name,
        setName] =
        useState("");

    const [email,
        setEmail] =
        useState("");

    const [password,
        setPassword] =
        useState("");

    const [department,
        setDepartment] =
        useState("");

    const [registered,
        setRegistered] =
        useState(false);

    // =========================
    // REGISTER FACULTY
    // =========================

    const registerFaculty =
        async () => {

            try {

                const response =

                    await axios.post(

                        "http://localhost:8082/faculty/register",

                        {

                            facultyId,

                            name,

                            email,

                            password,

                            department
                        }
                    );

                console.log(
                    response.data
                );

                // =========================
                // FACULTY EXISTS
                // =========================

                if (

                    response.data ===
                    "Faculty already exists"

                ) {

                    alert(
                        "Faculty already exists"
                    );

                    return;
                }

                alert(
                    "Faculty Registered Successfully"
                );

                setRegistered(
                    true
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Registration Failed"
                );
            }
        };

    // =========================
    // REDIRECT TO LOGIN
    // =========================

    if (registered) {

        return <FacultyLogin />;
    }

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>
                Faculty Registration
            </h1>

            <input

                type="text"

                placeholder="Faculty ID"

                value={facultyId}

                onChange={(e) =>

                    setFacultyId(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input

                type="text"

                placeholder="Faculty Name"

                value={name}

                onChange={(e) =>

                    setName(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input

                type="email"

                placeholder="Email"

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

                placeholder="Password"

                value={password}

                onChange={(e) =>

                    setPassword(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input

                type="text"

                placeholder="Department"

                value={department}

                onChange={(e) =>

                    setDepartment(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button

                onClick={
                    registerFaculty
                }
            >

                Register

            </button>

        </div>
    );
};

export default FacultyRegister;