package com.easyquiz.demo.dto;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String senhaAtual;
    private String novaSenha;
}