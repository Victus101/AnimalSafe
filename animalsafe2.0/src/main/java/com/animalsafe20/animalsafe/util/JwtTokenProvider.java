package com.animalsafe20.animalsafe.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utilidad para generar y validar tokens JWT
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MiSecretoMuySuperSecretoAnimalSafeSystemProyecto2026Masde32caracteres}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}") // 24 horas por defecto
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Genera un token JWT para un usuario
     * @param userId el ID del usuario
     * @param email el email del usuario
     * @param role el rol del usuario
     * @return el token JWT
     */
    public String generateToken(Long userId, String email, String role) {
        log.debug("Generando token JWT para usuario: {}", email);

        SecretKey key = getSigningKey();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Obtiene el email del token
     * @param token el token JWT
     * @return el email
     */
    public String getEmailFromToken(String token) {
        SecretKey key = getSigningKey();
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /**
     * Obtiene el ID de usuario del token
     * @param token el token JWT
     * @return el ID del usuario
     */
    public Long getUserIdFromToken(String token) {
        SecretKey key = getSigningKey();
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("userId", Long.class);
    }

    /**
     * Obtiene el rol del token
     * @param token el token JWT
     * @return el rol
     */
    public String getRoleFromToken(String token) {
        SecretKey key = getSigningKey();
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }

    /**
     * Valida un token JWT
     * @param token el token a validar
     * @return true si es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = getSigningKey();
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            log.debug("Token JWT validado correctamente");
            return true;
        } catch (Exception e) {
            log.error("Error validando el token JWT: {}", e.getMessage());
            return false;
        }
    }
}
