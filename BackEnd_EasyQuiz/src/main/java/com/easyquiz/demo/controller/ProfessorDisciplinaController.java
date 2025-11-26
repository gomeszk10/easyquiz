package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.Disciplina;
import com.easyquiz.demo.model.ProfessorDisciplina;
import com.easyquiz.demo.model.ProfessorDisciplinaId;
import com.easyquiz.demo.model.Usuario;
import com.easyquiz.demo.repository.ProfessorDisciplinaRepository;


import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/professordisciplina")
public class ProfessorDisciplinaController {

    private final ProfessorDisciplinaRepository repository;

    public ProfessorDisciplinaController(ProfessorDisciplinaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public List<ProfessorDisciplina> listar() {
        return repository.findAll();
    }

    //listar por id professorId
    @GetMapping("/listarPorIDProfessor/{professorId}")
    public ResponseEntity<List<ProfessorDisciplina>> listarPorIDProfessor(@PathVariable Integer professorId) {
        List<ProfessorDisciplina> todas = repository.findAll();
        List<ProfessorDisciplina> resultado = new ArrayList<>();
        for (ProfessorDisciplina pd : todas) {
            if (pd.getProfessor().getId().equals(professorId)) {
                resultado.add(pd);
            }
        }
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<ProfessorDisciplinaId> cadastrar(@RequestBody ProfessorDisciplinaId profDisciId) {
        ProfessorDisciplina professorDisciplina = new ProfessorDisciplina();
        Usuario professor = new Usuario();
        professor.setId(profDisciId.getProfessorId());
        Disciplina disciplina = new Disciplina();
        disciplina.setId(profDisciId.getDisciplinaId());
        professorDisciplina.setProfessor(professor);
        professorDisciplina.setDisciplina(disciplina);
        ProfessorDisciplinaId idComposto = new ProfessorDisciplinaId(profDisciId.getProfessorId(), profDisciId.getDisciplinaId());
        if (repository.existsById(idComposto)) {
            System.out.println("ProfessorDisciplina já cadastrado com id: " + idComposto);
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        professorDisciplina.setId(idComposto);
        repository.save(professorDisciplina);
        System.out.println("Cadastrado ProfessorDisciplina com id: " + idComposto);
        return ResponseEntity.status(HttpStatus.CREATED).body(idComposto);
    }
    @DeleteMapping("/delete/{professorId}/{disciplinaId}")
    public ResponseEntity<Void> deletar(@PathVariable Integer professorId, @PathVariable Integer disciplinaId) {
        ProfessorDisciplinaId idComposto = new ProfessorDisciplinaId(professorId, disciplinaId);
        return repository.findById(idComposto)
                .map(p -> {
                    repository.deleteById(idComposto);
                    System.out.println("Excluído ProfessorDisciplina com id: " + idComposto);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> {
                    System.out.println("Id Não encontrado ProfessorDisciplina com id: " + idComposto);
                    return ResponseEntity.notFound().build();
                });
    }

}
