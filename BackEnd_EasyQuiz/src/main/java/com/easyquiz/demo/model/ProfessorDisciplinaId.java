package com.easyquiz.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProfessorDisciplinaId implements Serializable {
    
    @Column(name = "professor_id")
    private Integer professorId;

    @Column(name = "disciplina_id")
    private Integer disciplinaId;
}