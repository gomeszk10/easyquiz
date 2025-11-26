package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.Questao;
import java.util.List;

public interface QuestaoRepository extends JpaRepository<Questao, Integer> {
    
    long countByTipo(String tipo);
    
    List<Questao> findByCriadoPorId(Integer criadoPorId);
    
    long countByCriadoPorId(Integer criadoPorId);
    long countByCriadoPorIdAndTipo(Integer criadoPorId, String tipo);

    boolean existsByDescricaoAndTipoAndDisciplinaIdAndCriadoPorId(
        String descricao, 
        String tipo, 
        Integer disciplinaId, 
        Integer criadoPorId
    );
}