package com.easyquiz.demo.service;

import com.easyquiz.demo.dto.OpcaoDTO;
import com.easyquiz.demo.dto.QuestaoDTO;
import com.easyquiz.demo.model.OpcaoResposta;
import com.easyquiz.demo.model.Questao;
import com.easyquiz.demo.repository.QuestaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestaoService {

    private final QuestaoRepository questaoRepository;

    public QuestaoService(QuestaoRepository questaoRepository) {
        this.questaoRepository = questaoRepository;
    }

    public List<QuestaoDTO> listarTodasFormatadas() {
        List<Questao> questoes = questaoRepository.findAll();
        return questoes.stream().map(this::converterParaDTO).collect(Collectors.toList());
    }

    public List<QuestaoDTO> listarPorCriador(Integer criadorId) {
        List<Questao> questoes = questaoRepository.findByCriadoPorId(criadorId);
        return questoes.stream().map(this::converterParaDTO).collect(Collectors.toList());
    }

    public QuestaoDTO buscarPorId(Integer id) {
        return questaoRepository.findById(id)
                .map(this::converterParaDTO)
                .orElse(null);
    }

    private QuestaoDTO converterParaDTO(Questao q) {
        QuestaoDTO dto = new QuestaoDTO();
        dto.setId(q.getId());
        dto.setEnunciado(q.getDescricao()); 
        dto.setDificuldade(q.getDificuldade());
        dto.setTipo(q.getTipo());
        
        if (q.getDisciplina() != null) {
            dto.setDisciplina(q.getDisciplina().getNome());
            dto.setDisciplinaId(q.getDisciplina().getId());
        }
        
        if (q.getCriadoPor() != null) {
            dto.setNomeCriador(q.getCriadoPor().getNome());
            dto.setCriadorId(q.getCriadoPor().getId());
        }

        if (q.getOpcoes() != null) {
            List<OpcaoDTO> opcoesDTO = q.getOpcoes().stream().map(opt -> {
                OpcaoDTO o = new OpcaoDTO();
                o.setId(opt.getId());
                o.setTexto(opt.getTextoResposta());
                o.setCorreta(opt.getCorreta());
                return o;
            }).collect(Collectors.toList());
            dto.setOpcoes(opcoesDTO);

            q.getOpcoes().stream()
                    .filter(OpcaoResposta::getCorreta)
                    .findFirst()
                    .ifPresent(opt -> dto.setRespostaCorreta(opt.getTextoResposta()));
        }
        
        return dto;
    }
}