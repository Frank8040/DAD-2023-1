import { Component, OnInit } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  conectado: boolean = false;

  webSocketEndPoint: string = 'http://localhost:7070/ws';
  destino: string = '/destino/mensaje';
  stompClient: any;
  mensaje: any = {};
  data: string = '';
  title: string = '';

  ngOnInit() {
    this.conectar();
  }

  conectar() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(<WebSocket>ws);
    this.stompClient.connect(
      {},
      (frame: any) => {
        if (frame.command === 'CONNECTED') {
          this.conectado = true;
        }
        this.stompClient.subscribe(this.destino, (sdkEvent: any) => {
          this.recibirMensaje(sdkEvent);
        });
      },
      this.errorCallBack
    );
  }

  errorCallBack(error: any) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.conectar();
    }, 5000);
  }

  desconectar() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.conectado = false;
    }
  }

  enviarMensaje() {
    this.stompClient.send('/app/saludo', {}, JSON.stringify(this.data));
  }

  recibirMensaje(message: any) {
    this.mensaje = JSON.parse(message.body);
  }
}
