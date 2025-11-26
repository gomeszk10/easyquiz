package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.ProfessorDisciplina;
import com.easyquiz.demo.model.ProfessorDisciplinaId;

public interface ProfessorDisciplinaRepository extends JpaRepository<ProfessorDisciplina, ProfessorDisciplinaId> {
    
}
