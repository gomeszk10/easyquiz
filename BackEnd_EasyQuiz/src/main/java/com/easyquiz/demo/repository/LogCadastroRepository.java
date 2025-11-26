package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.LogCadastro;

public interface LogCadastroRepository extends JpaRepository<LogCadastro, Integer> {

}
