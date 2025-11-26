package com.easyquiz.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailSimples(String para, String assunto, String texto) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("bigbrutto01@gmail.com"); 
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(texto);

            mailSender.send(message);
            System.out.println("E-mail enviado com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
            e.printStackTrace();
        }
    }
}