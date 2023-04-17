package com.example.demo.controller;


import com.example.demo.model.Mensaje;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {
    @MessageMapping("/saludo")
    @SendTo("/destino/mensaje")
    public Mensaje greeting(Mensaje mensaje) throws Exception {
        Thread.sleep(100); // simulated delay
        return mensaje;
    }
}