package com.easyquiz.demo.controller;

import com.easyquiz.demo.dto.ChangePasswordDTO;
import com.easyquiz.demo.dto.UserRegistrationDTO;
import com.easyquiz.demo.model.*;
import com.easyquiz.demo.repository.*;
import com.easyquiz.demo.service.EmailService;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final LogCadastroRepository logCadastroRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final QuestaoRepository questaoRepository; 

    // Injeção de dependência atualizada
    public UsuarioController(UsuarioRepository usuarioRepository, 
                             EmailService emailService, 
                             LogCadastroRepository logCadastroRepository,
                             ProfessorDisciplinaRepository professorDisciplinaRepository,
                             DisciplinaRepository disciplinaRepository,
                             QuestaoRepository questaoRepository) { 
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.logCadastroRepository = logCadastroRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.questaoRepository = questaoRepository; 
    }

    // --- Métodos de Consulta ---
    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obterUsuarioPorId(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Endpoint de Cadastro ---
    @PostMapping("/cadastrar/{adminId}") 
    public ResponseEntity<?> criarUsuario(@RequestBody UserRegistrationDTO dto, @PathVariable Integer adminId) {
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Usuario admin = adminOpt.get();
        if(!admin.getTipo().equals("ADMIN")) { 
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores podem cadastrar usuários.");
        }
        
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTipo(dto.getTipo());
        String senhaAleatoria = UUID.randomUUID().toString().substring(0, 16).replace("-", "");
        usuario.setSenha(senhaAleatoria);
        usuario.setCriadoEm(LocalDateTime.now());
        
        Usuario novoUsuario = usuarioRepository.save(usuario);

        if ("PROFESSOR".equalsIgnoreCase(dto.getTipo()) && dto.getDisciplinaIds() != null) {
            for (Integer discId : dto.getDisciplinaIds()) {
                disciplinaRepository.findById(discId).ifPresent(disciplina -> {
                    ProfessorDisciplina pd = new ProfessorDisciplina();
                    pd.setId(new ProfessorDisciplinaId(novoUsuario.getId(), discId));
                    pd.setProfessor(novoUsuario);
                    pd.setDisciplina(disciplina);
                    professorDisciplinaRepository.save(pd);
                });
            }
        }

        try {
            String textoEmail = "Olá " + usuario.getNome() + ",\n\nSua conta foi criada.\nSenha: " + senhaAleatoria;
            emailService.enviarEmailSimples(usuario.getEmail(), "Bem-vindo ao EasyQuiz", textoEmail);
        } catch (Exception e) { System.err.println("Erro email: " + e.getMessage()); }

        LogCadastro log = new LogCadastro();
        log.setAdmin(admin);
        log.setProfessor(novoUsuario);
        log.setDataHora(LocalDateTime.now());
        log.setAcao("CADASTRO"); 
        logCadastroRepository.save(log);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    // --- Atualização Admin ---
    @PutMapping("/admUpdate/{userId}/{adminId}")
    public ResponseEntity<?> atualizarUsuario_Admin(
            @PathVariable Integer userId, 
            @PathVariable Integer adminId, 
            @RequestBody UserRegistrationDTO dto) {
        
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty() || !adminOpt.get().getTipo().equals("ADMIN")) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Usuario admin = adminOpt.get();

        Optional<Usuario> userOpt = usuarioRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        Usuario usuario = userOpt.get();

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTipo(dto.getTipo());
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        
        // Atualiza Disciplinas
        if ("PROFESSOR".equalsIgnoreCase(dto.getTipo())) {
            List<ProfessorDisciplina> todosVinculos = professorDisciplinaRepository.findAll();
            List<ProfessorDisciplina> vinculosAtuais = todosVinculos.stream()
                .filter(pd -> pd.getProfessor().getId().equals(userId))
                .collect(Collectors.toList());

            List<Integer> novosIds = dto.getDisciplinaIds() != null ? dto.getDisciplinaIds() : new ArrayList<>();
            
            // Remove antigos
            for (ProfessorDisciplina pd : vinculosAtuais) {
                if (!novosIds.contains(pd.getDisciplina().getId())) {
                    professorDisciplinaRepository.delete(pd);
                }
            }

            // Adiciona novos
            for (Integer discId : novosIds) {
                boolean jaExiste = vinculosAtuais.stream()
                    .anyMatch(pd -> pd.getDisciplina().getId().equals(discId));
                
                if (!jaExiste) {
                    disciplinaRepository.findById(discId).ifPresent(disciplina -> {
                        ProfessorDisciplina novoPd = new ProfessorDisciplina();
                        novoPd.setId(new ProfessorDisciplinaId(userId, discId));
                        novoPd.setProfessor(usuarioSalvo);
                        novoPd.setDisciplina(disciplina);
                        professorDisciplinaRepository.save(novoPd);
                    });
                }
            }
        }

        LogCadastro log = new LogCadastro();
        log.setAdmin(admin);
        log.setProfessor(usuarioSalvo);
        log.setDataHora(LocalDateTime.now());
        log.setAcao("ALTERACAO");
        logCadastroRepository.save(log);

        return ResponseEntity.ok(usuarioSalvo);
    }

// --- EXCLUSÃO DE USUÁRIO (CORRIGIDO) ---
    @DeleteMapping("/delete/{userId}/{adminId}")
    public ResponseEntity<Void> deletarUsuario_Admin(@PathVariable Integer userId, @PathVariable Integer adminId) {
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty() || !adminOpt.get().getTipo().equals("ADMIN")) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return usuarioRepository.findById(userId).map(usuario -> {
            try {
                // 1. Apagar vínculos de disciplinas
                List<ProfessorDisciplina> vinculos = professorDisciplinaRepository.findAll().stream()
                    .filter(pd -> pd.getProfessor().getId().equals(userId))
                    .collect(Collectors.toList());
                professorDisciplinaRepository.deleteAll(vinculos);

                // 2. Apagar Questões criadas por este usuário
                List<Questao> questoes = questaoRepository.findByCriadoPorId(userId);
                questaoRepository.deleteAll(questoes);

                // 3. Apagar Logs onde este usuário é o ALVO
                List<LogCadastro> logsAlvo = logCadastroRepository.findAll().stream()
                    .filter(l -> l.getProfessor() != null && l.getProfessor().getId().equals(userId))
                    .collect(Collectors.toList());
                logCadastroRepository.deleteAll(logsAlvo);

                // 4. Apagar Logs onde este usuário foi o ADMIN
                List<LogCadastro> logsAdmin = logCadastroRepository.findAll().stream()
                    .filter(l -> l.getAdmin() != null && l.getAdmin().getId().equals(userId))
                    .collect(Collectors.toList());
                logCadastroRepository.deleteAll(logsAdmin);
                
                // 5. Finalmente, apaga o usuário
                usuarioRepository.deleteById(userId);
                
                System.out.println("Usuário " + userId + " excluído com todas as dependências.");
                return ResponseEntity.noContent().<Void>build();
                
            } catch (Exception e) {
                e.printStackTrace(); // Mostra o erro real no terminal
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Void>build();
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Outros Endpoints ---
    @PutMapping("/update/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNome(usuarioAtualizado.getNome());
            usuario.setEmail(usuarioAtualizado.getEmail());
            return ResponseEntity.ok(usuarioRepository.save(usuario));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/mudarSenha/{id}")
    public ResponseEntity<?> atualizarSenha(@PathVariable Integer id, @RequestBody ChangePasswordDTO dadosSenha) {
        return usuarioRepository.findById(id).map(usuario -> {
            if (!usuario.getSenha().equals(dadosSenha.getSenhaAtual())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A senha atual está incorreta.");
            }
            usuario.setSenha(dadosSenha.getNovaSenha());
            usuarioRepository.save(usuario);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(credenciais.get("email"));
        if (usuarioOpt.isPresent() && usuarioOpt.get().getSenha().equals(credenciais.get("senha"))) {
            return ResponseEntity.ok(usuarioOpt.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}