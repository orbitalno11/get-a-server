import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
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

    private paymentList: { clientId: string, transactionId: string }[] = []

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

    /**
     * Register client and transaction id
     * @param client
     * @param data
     */
    @SubscribeMessage("observe-payment")
    userPaymentHandshake(client: Socket, data: string) {
        const index = this.paymentList.indexOf({
            clientId: client.id,
            transactionId: data
        })

        if (index === -1) {
            this.paymentList.push({
                clientId: client.id,
                transactionId: data
            })
        }
    }

    /**
     * Send payment status to client
     * @param transactionId
     * @param amount
     * @param status
     */
    sendPaymentResult(transactionId: string, amount: number, status: boolean) {
        const index = this.paymentList.findIndex((item) => item.transactionId === transactionId)

        if (index > -1) {
            const client = this.paymentList[index]
            this.server.to(client.clientId).emit("payment-result", {
                "transactionId": transactionId,
                "amount": amount,
                "status": status
            })
            this.paymentList.splice(index, 1)
        }
    }
}
