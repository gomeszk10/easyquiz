package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.OpcaoResposta;
import com.easyquiz.demo.repository.OpcaoRespostaRepository;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/opcaoresposta")
public class OpcaoRespostaController {

    private final OpcaoRespostaRepository repository;

    public OpcaoRespostaController(OpcaoRespostaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public List<OpcaoResposta> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpcaoResposta> obterPorId(@PathVariable Integer id) {
        Optional<OpcaoResposta> opcao = repository.findById(id);
        return opcao.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Novo endpoint para listar opções de resposta por ID da Questão
    @GetMapping("/porQuestao/{questaoId}")
    public List<OpcaoResposta> listarPorQuestaoId(@PathVariable Integer questaoId) {
        return repository.findByQuestaoId(questaoId);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<OpcaoResposta> cadastrar(@RequestBody OpcaoResposta opcaoResposta) {
        OpcaoResposta novaOpcao = repository.save(opcaoResposta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaOpcao);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OpcaoResposta> atualizar(@PathVariable Integer id, @RequestBody OpcaoResposta opcaoAtualizada) {
        return repository.findById(id)
                .map(opcao -> {
                    opcao.setTextoResposta(opcaoAtualizada.getTextoResposta());
                    opcao.setCorreta(opcaoAtualizada.getCorreta());
                    
                    OpcaoResposta salva = repository.save(opcao);
                    return ResponseEntity.ok(salva);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        return repository.findById(id)
                .map(o -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}