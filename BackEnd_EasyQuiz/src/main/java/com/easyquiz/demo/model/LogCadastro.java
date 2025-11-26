package com.easyquiz.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "log_cadastro")
public class LogCadastro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Admin (foreign key -> usuario.id) with cascade on delete
    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_logcadastro_admin"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario admin;

    // Professor (foreign key -> usuario.id) with cascade on delete
    @ManyToOne(optional = false)
    @JoinColumn(name = "professor_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_logcadastro_professor"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario professor;

    // Use columnDefinition to match DEFAULT CURRENT_TIMESTAMP in DB
    @Column(name = "data_hora", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataHora;

    // NEW FIELD: To record the action (REGISTRATION, MODIFICATION, DELETION)
    @Column(name = "acao", nullable = false, length = 15)
    private String acao;
}