import dotenv from "dotenv"
dotenv.config()

// import custom extension
import './core/extension/common.extension'
import './core/extension/number.extension'
import './core/extension/string.extension'


import Server from './Server'

let server = new Server()
server.startServer()