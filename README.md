# MERNApp

To run this app,

First, you will need to install the necessary modules for both backend and frontend by using "npm install" with provided package.json.

Then you will have to provide your own .env file for both backend (nodemon.json) and frontend (.env).
  
  Backend: You will have to provide your own MongoDB Atlas info, such as user, password, DB name, and you will also have to provide your own 
           LocationIQ API key and your own secret key for token authentication.
  
  Frontend: You will have to provide mapbox api key, and the backend and asset URL, depending on your deloyment or just use http://localhost:*Your_choice*
  
After doing all that, you must build your React app in order for the frontend to use provided info from .env by executing a command: "npm run build"
