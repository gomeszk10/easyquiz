package com.easyquiz.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserRegistrationDTO {
    private String nome;
    private String email;
    private String tipo;
    private List<Integer> disciplinaIds;
}