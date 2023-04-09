import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

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
  ngAfterViewInit() {
    this.chatContainer.nativeElement.style.overflowY = 'auto';
  }

  conectado: boolean = false;

  webSocketEndPoint: string = 'http://localhost:7070/ws';
  destino: string = '/destino/mensaje';
  stompClient: any;
  mensaje: string = '';
  mensajes: any[] = [];
  data: string = '';
  title: string = '';
  enviado: boolean = false;

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
          this.enviado;
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
    this.enviado = true;
    this.data = '';
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }, 0);
  }

  recibirMensaje(message: any) {
    const mensajeRecibido: any = {
      cuerpo: JSON.parse(message.body).mensaje,
    };
    this.mensajes.push(mensajeRecibido);
    this.enviado;
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }, 0);
  }
}
