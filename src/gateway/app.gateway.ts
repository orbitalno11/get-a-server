import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { logger } from "../core/logging/Logger"

/**
 * App gateway web socket
 * @author orbitalno11 2021 A.D.
 */
@WebSocketGateway({ namespace: "_web" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server

    /**
     * Initial web socket
     * @param server
     */
    afterInit(server: Server) {
        logger.info("Initial socket")
    }

    /**
     * Detect client connect to web socket
     * @param client
     * @param args
     */
    handleConnection(client: Socket, ...args: any[]) {
        logger.info(`Client Connected: ${client.id}`)
    }

    /**
     * Detect client disconnect from web socket
     * @param client
     */
    handleDisconnect(client: Socket) {
        logger.info(`Client Disconnected: ${client.id}`)
    }

    /**
     * Send upload progress back to client
     * @param progress
     * @param clientId
     */
    sendUploadProgressToClient(progress: number, clientId: string) {
        this.server.to(`/_web#${clientId}`).emit("uploadProgress", progress)
    }
}
