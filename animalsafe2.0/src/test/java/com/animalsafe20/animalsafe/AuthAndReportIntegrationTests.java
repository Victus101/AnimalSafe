package com.animalsafe20.animalsafe;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthAndReportIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerCreatesUserAndReturnsTokenWithoutPassword() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Test User",
                                  "email": "register-test@animalsafe.test",
                                  "password": "password123",
                                  "passwordConfirm": "password123"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.userId").isNumber())
                .andExpect(jsonPath("$.email").value("register-test@animalsafe.test"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void protectedEndpointRejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userCannotReadAnotherUserProfile() throws Exception {
        AuthResult firstUser = register("first-user@animalsafe.test");
        AuthResult secondUser = register("second-user@animalsafe.test");

        mockMvc.perform(get("/api/users/" + secondUser.userId())
                        .header("Authorization", "Bearer " + firstUser.token()))
                .andExpect(status().isForbidden());
    }

    @Test
    void ownUserProfileCanBeReadWithoutPassword() throws Exception {
        AuthResult user = register("profile-owner@animalsafe.test");

        mockMvc.perform(get("/api/users/" + user.userId())
                        .header("Authorization", "Bearer " + user.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.userId()))
                .andExpect(jsonPath("$.email").value("profile-owner@animalsafe.test"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void invalidLoginReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "missing@animalsafe.test",
                                  "password": "wrong-password"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void invalidReportStatusReturnsBadRequest() throws Exception {
        String token = registerAndGetToken("status-reader@animalsafe.test");

        mockMvc.perform(get("/api/reports/status/invalid")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void authenticatedUserCanCreateReport() throws Exception {
        String token = registerAndGetToken("report-owner@animalsafe.test");

        mockMvc.perform(post("/api/reports")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Perro herido",
                                  "description": "Perro necesita ayuda cerca de la avenida principal",
                                  "latitude": -33.4489,
                                  "longitude": -70.6693,
                                  "address": "Santiago Centro",
                                  "animalType": "DOG",
                                  "animalCondition": "HERIDO",
                                  "animalDescription": "Tiene una pata lastimada"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.location.latitude").value(-33.4489))
                .andExpect(jsonPath("$.salvita.animalType").value("DOG"));
    }

    private String registerAndGetToken(String email) throws Exception {
        return register(email).token();
    }

    private AuthResult register(String email) throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Report Owner",
                                  "email": "%s",
                                  "password": "password123",
                                  "passwordConfirm": "password123"
                                }
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        String token = json.get("token").asText();
        assertThat(token).isNotBlank();
        return new AuthResult(token, json.get("userId").asLong());
    }

    private record AuthResult(String token, Long userId) {
    }
}
