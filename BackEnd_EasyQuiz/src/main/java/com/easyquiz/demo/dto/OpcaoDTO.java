package com.easyquiz.demo.dto;
import lombok.Data;

@Data
public class OpcaoDTO {
    private Integer id;
    private String texto;
    private boolean correta;
}