package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.OpcaoResposta;
import java.util.List;

public interface OpcaoRespostaRepository extends JpaRepository<OpcaoResposta, Integer> {
    
    List<OpcaoResposta> findByQuestaoId(Integer questaoId);
}