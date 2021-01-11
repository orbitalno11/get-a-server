# get-a-server

Server for GET-A web application

# How to run
-  **Requirement**
	- docker
	- java 8
	- maven [<<can download and install from this link>>](https://maven.apache.org/install.html)
- **Step to run**
	- clone this project
	- in the root directory use this command
`mvn install -DskipTests`
the project will build for `jar` file. it will have 6 module (10/01/2021)
	- use `docker` command
`docker-compose up --build -d`
- let fun with the project
- **Important**
	- mysql server port at `3306`
	- phpmyadmin port at `8082`
	- authorization server port at `8090`
	- resource server port at `8091`