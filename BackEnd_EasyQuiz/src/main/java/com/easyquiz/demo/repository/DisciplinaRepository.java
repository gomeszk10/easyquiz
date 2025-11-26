package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.Disciplina;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Integer> {

}
