# Parking-Management-system
Project made using MERN stack(MongoDB, Express, React, Node).

Basic Functionalities:-
1) User login/registration
2) Admin login/registration
3) Dashboard (Here all reserved/unreserved parking slots will be visible)

User functionalities:-
1) User can book a parking slot.
2) User can see all of his/her bookings.
3) User can give feedback.
4) User can see the reply from admin.

Admin functionalities:-
1) Admin can add new parking space.
2) Admin can delete existing parking space.
3) Admin can book a parking space.
4) Admin can see all bookings made by user.
5) Admin can see all user feedbacks.
6) Admin can reply to any user's feedback.

How to run this project:-
1) Download this code.
2) Open the folder and run "npm i" in terminal.
3) Go to src -> server -> server.js and type your own mongoDB URI in const dbUri.
4) In server folder run "node server.js" to start server side code.
5) Open src folder and run "npm start" in terminal to start client side code.

One bug:- If you want to register new "user", In dropdown bar first click "admin" and then again "user". 

For admin registration it works fine, you can directly click "admin" in dropdown bar.
