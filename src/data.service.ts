import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { DataGateway } from './gateway/data.gateway'; // 추가

@Injectable()
export class DataService implements OnModuleInit {
  private ws: WebSocket;

  constructor(private dataGateway: DataGateway) {} // 추가

  onModuleInit(): void {
    this.connectToWebSocket();
  }

  private connectToWebSocket(): void {
    this.ws = new WebSocket('ws://192.168.50.102:88');

    this.ws.on('open', () => {
      console.log('Connected to WebSocket server');
    });

    this.ws.on('message', (data: string) => {
      console.log('Received data: ', data);
      this.dataGateway.broadcast(data); // 추가
    });

    this.ws.on('error', (error: Error) => {
      console.error(`WebSocket error: ${error.message}`);
    });

    this.ws.on('close', (code: number, reason: string) => {
      console.log(
        `WebSocket connection closed, code: ${code}, reason: ${reason}`,
      );
    });
  }
}
