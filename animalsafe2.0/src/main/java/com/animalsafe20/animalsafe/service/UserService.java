package com.animalsafe20.animalsafe.service;

import com.animalsafe20.animalsafe.dto.UserResponse;
import com.animalsafe20.animalsafe.exception.ResourceNotFoundException;
import com.animalsafe20.animalsafe.model.User;
import com.animalsafe20.animalsafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para operaciones de usuarios
 * Contiene la lógica de negocio relacionada con usuarios
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /**
     * Obtiene todos los usuarios
     * @return lista de usuarios
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.info("Obteniendo todos los usuarios");
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un usuario por ID
     * @param id el ID del usuario
     * @return respuesta del usuario
     * @throws ResourceNotFoundException si no existe
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        log.info("Obteniendo usuario con ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + id + " no encontrado"));
        return convertToResponse(user);
    }

    /**
     * Obtiene un usuario por email
     * @param email el email del usuario
     * @return el usuario encontrado
     * @throws ResourceNotFoundException si no existe
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        log.info("Obteniendo usuario con email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con email " + email + " no encontrado"));
    }

    /**
     * Verifica si existe un usuario con el email
     * @param email el email a verificar
     * @return true si existe, false en caso contrario
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Guarda un nuevo usuario
     * @param user el usuario a guardar
     * @return el usuario guardado
     */
    public User saveUser(User user) {
        log.info("Guardando nuevo usuario con email: {}", user.getEmail());
        return userRepository.save(user);
    }

    /**
     * Actualiza un usuario existente
     * @param id el ID del usuario
     * @param updatedUser los datos actualizados
     * @return el usuario actualizado
     * @throws ResourceNotFoundException si no existe
     */
    public User updateUser(Long id, User updatedUser) {
        log.info("Actualizando usuario con ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + id + " no encontrado"));

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }

        return userRepository.save(user);
    }

    /**
     * Elimina un usuario
     * @param id el ID del usuario
     * @throws ResourceNotFoundException si no existe
     */
    public void deleteUser(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario con ID " + id + " no encontrado");
        }
        userRepository.deleteById(id);
    }

    /**
     * Convierte una entidad User a UserResponse
     * @param user la entidad
     * @return el DTO de respuesta
     */
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .createdAt(user.getCreatedAt())
                .reportCount(user.getReports() != null ? user.getReports().size() : 0)
                .build();
    }
}
