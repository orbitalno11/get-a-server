import dotenv from "dotenv"
dotenv.config()

import Server from './Server'

let server = new Server()
server.startServer()