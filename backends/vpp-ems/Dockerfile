# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add current directory code to /app in container
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn
RUN pip install gunicorn

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run gunicorn server when the container launches
CMD ["gunicorn", "-b", ":5000", "run:app"]
