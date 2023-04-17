import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

interface Mensaje {
  cuerpo: string;
  enviado: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {
    this.chatContainer = new ElementRef(null);
  }

  @ViewChild('chatContainer', { static: false }) chatContainer: ElementRef;

  conectado: boolean = false;

  webSocketEndPoint: string = 'http://localhost:8080/ws';
  destino: string = '/destino/mensaje';
  stompClient: any;
  mensaje: any = {};
  mensajes: Mensaje[] = [];
  data: string = '';
  title: string = '';

  ngOnInit() {
    this.conectar();
  }

  ngAfterViewInit() {
    this.chatContainer.nativeElement.style.overflowY = 'auto';
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

  errorCallBack = (error: any) => {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.conectar();
    }, 5000);
  };

  desconectar() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.conectado = false;
    }
  }

  enviarMensaje() {
    const mensajeEnviado: Mensaje = {
      cuerpo: this.data,
      enviado: true,
    };
    this.mensajes.push(mensajeEnviado);
    this.stompClient.send('/app/saludo', {}, JSON.stringify(this.data));
    this.data = '';
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }, 0);
  }

  recibirMensaje(message: any) {
    const mensajeRecibido: Mensaje = {
      cuerpo: JSON.parse(message.body).mensaje,
      enviado: false,
    };
    this.mensajes.push(mensajeRecibido);
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }, 0);
  }
}
