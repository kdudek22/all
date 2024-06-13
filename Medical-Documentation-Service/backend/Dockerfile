# import python3.10 image
FROM python:3.10-slim-bullseye

# set the working directory
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client

# copy the requirements file
COPY setup.py .

# install dependencies
RUN pip install -e .


# copy the content of the local src directory to the working directory
COPY . .

# Install PostgreSQL client

RUN chmod +x ./entrypoint.sh

# command to run on container start
ENTRYPOINT ["./entrypoint.sh"]
