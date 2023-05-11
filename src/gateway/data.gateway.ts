// src/gateway/data.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class DataGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.broadcast('A client connected');
  }

  broadcast(data: any): void {
    this.server.emit('broadcast', data);
  }

  @SubscribeMessage('esp32Data')
  handleEsp32Data(client: Socket, data: any): void {
    // ESP32에서 받은 데이터를 WebSocket을 통해 클라이언트에게 전달
    this.broadcast(data);
  }
}
