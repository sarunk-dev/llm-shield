# Attack App

## Description

This is a full stack app, node.js for backend, and React frontend

The frontend has the following:
Single page with the following:
A button called Refresh Table

Once clicked, the button visits backend-endpoint/visitors
it returns a json list of visitors, IP, name, and date visited

The backend has the following:
This is an express app

Endpoint 1:
backend-endpoint/image
serves an image from the apps/data/image.png

Endpoint 2:
backend-endpoint/visitors
returns a json list of visitors organized by ascending order

## Deployment

A dockerfile that creates an image on frontend and backend app and serve it
A docker-compose.yml file that spins up the container and attach localhost:4000
