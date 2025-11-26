package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.Disciplina;
import com.easyquiz.demo.repository.DisciplinaRepository;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/disciplina")
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaController(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping("/listar")
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> obterPorId(@PathVariable Integer id) {
        Optional<Disciplina> disciplina = disciplinaRepository.findById(id);
        // Se a disciplina não for encontrada, retorna 404 Not Found
        if (!disciplina.isPresent())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        //retorna a disciplina encontrada
        return ResponseEntity.ok(disciplina.get());
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Disciplina> cadastrar(@RequestBody Disciplina disciplina) {
        Disciplina nova = disciplinaRepository.save(disciplina);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Disciplina> atualizar(@PathVariable Integer id, @RequestBody Disciplina disciplinaAtualizada) {
        return disciplinaRepository.findById(id)
                .map(disciplina -> {
                    disciplina.setNome(disciplinaAtualizada.getNome());
                    Disciplina salvo = disciplinaRepository.save(disciplina);
                    return ResponseEntity.ok(salvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        Disciplina disciplina = disciplinaRepository.findById(id).orElse(null);
        if (disciplina == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    
        disciplinaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
