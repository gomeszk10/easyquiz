package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.LogCadastro;
import com.easyquiz.demo.repository.LogCadastroRepository;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/logcadastro")
public class LogCadastroController {

    private final LogCadastroRepository repository;

    public LogCadastroController(LogCadastroRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public List<LogCadastro> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LogCadastro> obterPorId(@PathVariable Integer id) {
        Optional<LogCadastro> log = repository.findById(id);
        return log.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        return repository.findById(id)
                .map(l -> {
                    repository.deleteById(id);
                    System.out.println("Deletado log de cadastro com id: " + id + " em " + LocalDateTime.now());
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}