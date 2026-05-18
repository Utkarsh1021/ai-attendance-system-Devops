import face_recognition
import numpy as np
import os
import base64

from flask import (
    Flask,
    request,
    jsonify
)
from flask_cors import CORS

import cv2

app = Flask(__name__)
CORS(app)

# =========================
# CREATE DATASET FOLDER
# =========================

os.makedirs("dataset", exist_ok=True)

# =========================
# LOAD OPENCV FACE DETECTOR
# =========================

face_cascade = cv2.CascadeClassifier(

    cv2.data.haarcascades
    + 'haarcascade_frontalface_default.xml'
)

# =========================
# LOAD KNOWN FACES
# =========================

known_face_encodings = []

known_face_names = []


def load_known_faces():

    known_face_encodings.clear()

    known_face_names.clear()

    dataset_path = "dataset"

    if not os.path.exists(dataset_path):
        return

    for filename in os.listdir(dataset_path):

        if (
            filename.endswith(".jpg")
            or
            filename.endswith(".png")
        ):

            image_path = os.path.join(
                dataset_path,
                filename
            )

            image = (
                face_recognition
                .load_image_file(
                    image_path
                )
            )

            encodings = (
                face_recognition
                .face_encodings(image)
            )

            if len(encodings) > 0:

                encoding = encodings[0]

                known_face_encodings.append(
                    encoding
                )

                name = os.path.splitext(
                    filename
                )[0]

                known_face_names.append(
                    name
                )

                print(
                    f"Loaded face: {name}"
                )

            else:

                print(
                    f"No face found in: {filename}"
                )


# =========================
# HOME API
# =========================

@app.route("/")
def home():

    return (
        "AI Face Recognition "
        "Service Running"
    )


# =========================
# REACT FACE REGISTRATION API
# =========================

@app.route(
    '/register-face',
    methods=['POST']
)
def register_face():

    try:

        data = request.json

        image_data = data['image']

        registration_number = data[
            'registrationNumber'
        ]

        image_data = (
            image_data.split(",")[1]
        )

        image_bytes = (
            base64.b64decode(
                image_data
            )
        )

        image_path = (
            f"dataset/"
            f"{registration_number}.png"
        )

        with open(
            image_path,
            "wb"
        ) as f:

            f.write(image_bytes)

        # Reload dataset
        load_known_faces()

        return jsonify({

            "message":
            "Face Registered Successfully",

            "imagePath":
            image_path

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# =========================
# API FACE RECOGNITION
# =========================

@app.route(
    '/recognize-face',
    methods=['POST']
)
def recognize_face_api():

    try:

        data = request.json

        image_data = data['image']

        image_data = (
            image_data.split(",")[1]
        )

        image_bytes = (
            base64.b64decode(
                image_data
            )
        )

        temp_path = "temp.png"

        with open(
            temp_path,
            "wb"
        ) as f:

            f.write(image_bytes)

        unknown_image = (
            face_recognition
            .load_image_file(
                temp_path
            )
        )

        unknown_encodings = (
            face_recognition
            .face_encodings(
                unknown_image
            )
        )

        if len(unknown_encodings) == 0:

            return jsonify({

                "matched": False,

                "message":
                "No Face Found"

            })

        unknown_encoding = (
            unknown_encodings[0]
        )

        if len(known_face_encodings) == 0:

            return jsonify({

                "matched": False,

                "message":
                "No Registered Faces"

            })

        # =========================
        # FACE MATCHING
        # =========================

        matches = (
            face_recognition
            .compare_faces(

                known_face_encodings,

                unknown_encoding,

                tolerance=0.65
            )
        )

        face_distances = (
            face_recognition
            .face_distance(

                known_face_encodings,

                unknown_encoding
            )
        )

        print(
            "Face Distances:",
            face_distances
        )

        best_match_index = (
            np.argmin(
                face_distances
            )
        )

        print(
            "Best Match Index:",
            best_match_index
        )

        print(
            "Matched Student:",
            known_face_names[
                best_match_index
            ]
        )

        # =========================
        # MATCH FOUND
        # =========================

        if (

            matches[
                best_match_index
            ]

            or

            face_distances[
                best_match_index
            ] < 0.65
        ):

            name = (
                known_face_names[
                    best_match_index
                ]
            )

            return jsonify({

                "matched": True,

                "registrationNumber":
                name

            })

        return jsonify({

            "matched": False,

            "message":
            "Face Not Recognized"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# =========================
# FACE DETECTION API
# =========================

@app.route("/detect")
def detect():

    cap = cv2.VideoCapture(
        0,
        cv2.CAP_DSHOW
    )

    if not cap.isOpened():

        return (
            "Camera not detected"
        )

    cv2.namedWindow(
        "Face Detection",
        cv2.WINDOW_NORMAL
    )

    cv2.resizeWindow(
        "Face Detection",
        900,
        700
    )

    cv2.setWindowProperty(

        "Face Detection",

        cv2.WND_PROP_TOPMOST,

        1
    )

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        gray = cv2.cvtColor(

            frame,

            cv2.COLOR_BGR2GRAY
        )

        faces = (
            face_cascade.detectMultiScale(

                gray,

                scaleFactor=1.1,

                minNeighbors=5,

                minSize=(30, 30)
            )
        )

        for (x, y, w, h) in faces:

            cv2.rectangle(

                frame,

                (x, y),

                (x + w, y + h),

                (0, 255, 0),

                2
            )

        cv2.imshow(
            "Face Detection",
            frame
        )

        key = (
            cv2.waitKey(1)
            & 0xFF
        )

        if key == ord('q'):
            break

        if key == 27:
            break

        if cv2.getWindowProperty(

            "Face Detection",

            cv2.WND_PROP_VISIBLE

        ) < 1:

            break

    cap.release()

    cv2.destroyAllWindows()

    return (
        "Face Detection Closed Successfully"
    )


# =========================
# FACE REGISTRATION API
# =========================

@app.route("/register/<name>")
def register(name):

    cap = cv2.VideoCapture(
        0,
        cv2.CAP_DSHOW
    )

    if not cap.isOpened():

        return (
            "Camera not detected"
        )

    cv2.namedWindow(

        "Register Face",

        cv2.WINDOW_NORMAL
    )

    cv2.resizeWindow(

        "Register Face",

        900,
        700
    )

    cv2.setWindowProperty(

        "Register Face",

        cv2.WND_PROP_TOPMOST,

        1
    )

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        clean_frame = frame.copy()

        gray = cv2.cvtColor(

            frame,

            cv2.COLOR_BGR2GRAY
        )

        faces = (
            face_cascade.detectMultiScale(

                gray,

                scaleFactor=1.1,

                minNeighbors=5,

                minSize=(30, 30)
            )
        )

        for (x, y, w, h) in faces:

            cv2.rectangle(

                frame,

                (x, y),

                (x + w, y + h),

                (0, 255, 0),

                2
            )

        cv2.imshow(
            "Register Face",
            frame
        )

        key = (
            cv2.waitKey(1)
            & 0xFF
        )

        if key == ord('s'):

            filepath = (
                f"dataset/{name}.jpg"
            )

            cv2.imwrite(
                filepath,
                clean_frame
            )

            load_known_faces()

            cap.release()

            cv2.destroyAllWindows()

            return (
                f"Face registered successfully as {name}"
            )

        if key == ord('q'):
            break

        if key == 27:
            break

        if cv2.getWindowProperty(

            "Register Face",

            cv2.WND_PROP_VISIBLE

        ) < 1:

            break

    cap.release()

    cv2.destroyAllWindows()

    return (
        "Registration cancelled"
    )


# =========================
# REAL FACE RECOGNITION
# =========================

@app.route("/recognize")
def recognize():

    cap = cv2.VideoCapture(
        0,
        cv2.CAP_DSHOW
    )

    if not cap.isOpened():

        return (
            "Camera not detected"
        )

    cv2.namedWindow(

        "Face Recognition",

        cv2.WINDOW_NORMAL
    )

    cv2.resizeWindow(

        "Face Recognition",

        900,
        700
    )

    cv2.setWindowProperty(

        "Face Recognition",

        cv2.WND_PROP_TOPMOST,

        1
    )

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        small_frame = cv2.resize(

            frame,

            (0, 0),

            fx=0.25,

            fy=0.25
        )

        rgb_small_frame = cv2.cvtColor(

            small_frame,

            cv2.COLOR_BGR2RGB
        )

        face_locations = (

            face_recognition
            .face_locations(
                rgb_small_frame
            )
        )

        face_encodings = (

            face_recognition
            .face_encodings(

                rgb_small_frame,

                face_locations
            )
        )

        for (
            top,
            right,
            bottom,
            left
        ), face_encoding in zip(

            face_locations,

            face_encodings
        ):

            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            matches = (

                face_recognition
                .compare_faces(

                    known_face_encodings,

                    face_encoding,

                    tolerance=0.65
                )
            )

            name = "Unknown"

            face_distances = (

                face_recognition
                .face_distance(

                    known_face_encodings,

                    face_encoding
                )
            )

            if len(face_distances) > 0:

                best_match_index = (
                    np.argmin(
                        face_distances
                    )
                )

                if (
                    matches[
                        best_match_index
                    ]

                    or

                    face_distances[
                        best_match_index
                    ] < 0.65
                ):

                    name = (
                        known_face_names[
                            best_match_index
                        ]
                    )

            cv2.rectangle(

                frame,

                (left, top),

                (right, bottom),

                (0, 255, 0),

                2
            )

            cv2.putText(

                frame,

                name,

                (left, top - 10),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.9,

                (0, 255, 0),

                2
            )

        cv2.imshow(
            "Face Recognition",
            frame
        )

        key = (
            cv2.waitKey(1)
            & 0xFF
        )

        if key == ord('q'):
            break

        if key == 27:
            break

        if cv2.getWindowProperty(

            "Face Recognition",

            cv2.WND_PROP_VISIBLE

        ) < 1:

            break

    cap.release()

    cv2.destroyAllWindows()

    return (
        "Face Recognition Closed"
    )


# =========================
# START APPLICATION
# =========================

if __name__ == "__main__":

    load_known_faces()

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True
    )