package com.easyquiz.demo.dto;
import lombok.Data;
import java.util.List;

@Data
public class QuestaoDTO {
    private Integer id;
    private String enunciado; 
    private String descricao;
    private String dificuldade;
    private String tipo;
    private String disciplina;
    private Integer disciplinaId;
    private String nomeCriador;
    private Integer criadorId;
    private List<OpcaoDTO> opcoes;
    private String respostaCorreta;
}