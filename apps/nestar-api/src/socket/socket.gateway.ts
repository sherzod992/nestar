import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log(`WebSocket Server Initialized, total clients: ${this.summaryClient}`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;
    this.logger.log(`Client connected. Total clients: ${this.summaryClient}`);
  }

  handleDisconnect(client: WebSocket) {
    this.summaryClient--;
    this.logger.log(`Client disconnected. Remaining clients: ${this.summaryClient}==`);
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, payload: any): string {
    this.logger.log(`Received message: ${JSON.stringify(payload)}`);
    return 'Hello world!';
  }
}
