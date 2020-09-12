FROM python:3.7-slim 

RUN pip install pipenv

RUN apt-get update && apt-get install -y \
    python3-pip python-dev build-essential

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

COPY Pipfile ./
COPY Pipfile.lock ./ 
RUN pipenv install --deploy

COPY . .

ENV FLASK_RUN_HOST 0.0.0.0
EXPOSE 5000
CMD pipenv run python -m flask run 