import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { DataGateway } from './gateway/data.gateway'; // DataGateway를 import

@Injectable()
export class DataService implements OnModuleInit {
  private ws: WebSocket;
  private timeoutId: NodeJS.Timeout; // Timeout ID를 저장

  constructor(private dataGateway: DataGateway) {} // DataGateway를 주입

  onModuleInit(): void {
    this.connectToWebSocket();
    this.resetTimeout();
  }

  private connectToWebSocket(): void {
    this.ws = new WebSocket('ws://ESP32_SERVER_IP:88'); // ESP32_SERVER_IP 부분을 실제 ESP32 서버의 IP 주소로 바꾸세요.

    this.ws.on('open', () => {
      console.log('Connected to WebSocket server');
      this.resetTimeout(); // 연결이 성공하면 타임아웃 재설정
    });

    this.ws.on('message', (data: string) => {
      console.log('Received data: ', data);
      // 이곳에서 수신된 데이터를 처리하면 됩니다.
      this.dataGateway.broadcast(data); // 수신된 데이터를 브로드캐스트
      this.resetTimeout(); // 데이터를 받으면 타임아웃 재설정
    });

    this.ws.on('error', (error: Error) => {
      console.error(`WebSocket error: ${error.message}`);
    });

    this.ws.on('close', (code: number, reason: string) => {
      console.log(
        `WebSocket connection closed, code: ${code}, reason: ${reason}`,
      );
      // 연결이 끊어졌을 때 재연결하려면 이곳에 로직을 추가하세요.
      setTimeout(() => this.connectToWebSocket(), 5000);
    });
  }

  // 타임아웃 재설정
  private resetTimeout(): void {
    clearTimeout(this.timeoutId);
    // 5초 동안 데이터를 받지 못하면 메시지 브로드캐스트
    this.timeoutId = setTimeout(() => {
      console.log('ESP32로부터 데이터가 들어오지 않습니다');
      this.dataGateway.broadcast('ESP32로부터 데이터가 들어오지 않습니다');
      this.resetTimeout(); // 메시지를 브로드캐스트한 후 다시 타임아웃 재설정
    }, 5000);
  }
}
