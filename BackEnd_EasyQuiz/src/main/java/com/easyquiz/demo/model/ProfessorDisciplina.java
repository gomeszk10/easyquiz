package com.easyquiz.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ForeignKey;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "professor_disciplina")
public class ProfessorDisciplina {

    @EmbeddedId 
    private ProfessorDisciplinaId id;

    @MapsId("professorId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "professor_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_professor_disciplina_professor"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario professor;

    @MapsId("disciplinaId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_professor_disciplina_disciplina"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Disciplina disciplina;

}