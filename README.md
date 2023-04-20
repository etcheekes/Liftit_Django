# Lift-It

Try out Lift-It [here](https://lift-it.up.railway.app/home/).

This project continues my Lift-It app (see the original repository [here](https://github.com/etcheekes/LiftIt)). The main purpose is to recreate the app but using Django and PostgreSQL as the backend instead of flask and SQLite for two reasons.

Firstly, I desired to expand my programming experience by using Django (a more popular backend python framework). Secondly, PostgreSQL is more suitable (than SQLite) in allowing concurrent usage. As my goal was to deploy this app online, concurrent usage was a necessity.

If wishing to see Lift-It's web app's frontend development and/or the flask backend please go to the depository [here](https://github.com/etcheekes/LiftIt) to see the commit history which covers the start of the project up to 07/02/23.

## What is Lift-It?

Lift-It is a dynamic workout planner web application that lets users browse exercises, make exercises, and create personal workout plans. Try it out [here](https://lift-it.up.railway.app/home/)!

Key features include:

•	Browse 206 default exercises by name, muscle, or equipment.

•	Add or remove exercises.

•	Select exercises from the app’s database to create personalised workout routines.

•	Modify a routine by adding/removing exercises or changing their repetition/weight number.

•	Account creation enables users to access their unique exercises and save routines for later use.

## Technical details

The frontend uses HTML, CSS (and the Bootstrap library), and JavaScript. Each page is responsive and adapts to different screen sizes. JavaScript and its Fetch API was used to implemented dynamic elements.

The backend uses Python and Django as its web application framework while PostgreSQL serves as the database engine. Django’s ORM (Object-Relational mapping) was used for queries.

Lift-It was deployed using the PaaS (platform as a service) [Railway.app](https://railway.app/).

