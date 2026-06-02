FROM python:3.10

WORKDIR /app

# Install OpenCV dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    cmake \
    git

COPY requirements.txt .


RUN pip install --upgrade pip wheel
RUN pip install setuptools==69.5.1
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir \
    git+https://github.com/ageitgey/face_recognition_models


COPY . .

EXPOSE 5000

CMD ["python", "app.py"]