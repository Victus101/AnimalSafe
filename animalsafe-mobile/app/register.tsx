/**
 * Register Screen - AnimalSafe Mobile
 * Matches Login Screen premium aesthetics
 * Single-select user types
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StyledTextInput } from '../src/components/TextInput';
import { API_URL } from '../src/config/api';
import { useAuthStore } from '../src/store/authStore';
import { colors, spacing } from '../src/theme';

const SOFT_BG = '#FDF8F9';
const PINK_GRADIENT: [string, string] = ['#F48FB1', '#EC407A'];

type UserType = 'VOLUNTARIO' | 'RESCATISTA' | 'ACOGIDA';

interface UserTypeOption {
  id: UserType;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const USER_TYPE_OPTIONS: UserTypeOption[] = [
  { id: 'VOLUNTARIO', label: 'Voluntario', icon: 'dog' },
  { id: 'RESCATISTA', label: 'Rescatista', icon: 'ambulance' },
  { id: 'ACOGIDA', label: 'Casa de acogida', icon: 'home-heart' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Selection Logic - Single selection
  const toggleUserType = (type: UserType) => {
    setSelectedType(prev => prev === type ? null : type);
    if (errors.userType) setErrors(prev => ({ ...prev, userType: '' }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    
    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Introduce un correo válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';
    }

    if (!selectedType) {
      newErrors.userType = 'Selecciona un tipo de perfil';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = 
    name.trim().length > 0 && 
    email.includes('@') && 
    password.length >= 6 && 
    password === passwordConfirm && 
    selectedType !== null;

  // Handle Register
  const handleRegister = async () => {
    // 1. Precise Validation Check
    if (!validateForm()) {
      console.log('VALIDATION FAILED', errors);
      return;
    }

    // 2. Debug Log BEFORE Request (Crucial for identifying data mismatches)
    console.log('REGISTER DATA:', {
      name,
      email,
      password,
      passwordConfirm,
      userType: selectedType, // Already uppercase from USER_TYPE_OPTIONS
    });

    setIsLoading(true);
    try {
      // 🚨 MIRA ESTE LOG EN TU CONSOLA - DEBE DECIR 'DEBUG_IP'
      const debugUrl = `${API_URL}/api/auth/register`;
      console.log('DEBUG_IP:', debugUrl);

      const response = await fetch(debugUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          passwordConfirm,
          userType: selectedType,
        }),
      });

      // 4. Debug Log AFTER Response
      const data = await response.json();
      console.log('REGISTER RESPONSE:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (response.ok) {
        console.log('USER SAVED (REGISTER):', data.user);
        useAuthStore.getState().setUser(data.user);
        useAuthStore.getState().setToken(data.token);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la cuenta. Revisa los logs.');
      }
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      Alert.alert(
        'Error de conexión', 
        'No se pudo conectar con el servidor. Si estás en un dispositivo real, asegúrate de usar tu IP local (ej: 192.168.x.x) y no "localhost".'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.container, { backgroundColor: SOFT_BG }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.brandSection}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.appTitle}>Crear Cuenta</Text>
              <Text style={styles.appSubtitle}>Únete a nuestra misión 🐾</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <View style={styles.formContainer}>
                
                {/* Name */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <StyledTextInput
                    placeholder="Juan Pérez"
                    icon="account-outline"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    editable={!isLoading}
                    error={errors.name}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <StyledTextInput
                    ref={emailRef}
                    placeholder="ejemplo@correo.com"
                    icon="email-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    editable={!isLoading}
                    error={errors.email}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* User Type Selection */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>¿Cómo quieres ayudar?</Text>
                  <View style={styles.typeGrid}>
                    {USER_TYPE_OPTIONS.map((option) => {
                      const isSelected = selectedType === option.id;
                      return (
                        <TouchableOpacity
                          key={option.id}
                          activeOpacity={0.7}
                          onPress={() => toggleUserType(option.id)}
                          style={[
                            styles.typeCard,
                            isSelected && styles.typeCardSelected
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={option.icon}
                            size={24}
                            color={isSelected ? colors.primary : colors.textSecondary}
                          />
                          <Text style={[
                            styles.typeLabel,
                            isSelected && styles.typeLabelSelected
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {errors.userType && <Text style={styles.errorText}>{errors.userType}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Contraseña</Text>
                  <StyledTextInput
                    ref={passwordRef}
                    placeholder="••••••••"
                    icon="lock-outline"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    showPasswordToggle
                    isPasswordVisible={showPassword}
                    onPasswordToggle={setShowPassword}
                    editable={!isLoading}
                    error={errors.password}
                  />
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <StyledTextInput
                    ref={confirmPasswordRef}
                    placeholder="••••••••"
                    icon="lock-check-outline"
                    secureTextEntry={!showPassword}
                    value={passwordConfirm}
                    onChangeText={(text) => {
                      setPasswordConfirm(text);
                      if (errors.passwordConfirm) setErrors(prev => ({ ...prev, passwordConfirm: '' }));
                    }}
                    editable={!isLoading}
                    error={errors.passwordConfirm}
                  />
                  {errors.passwordConfirm && <Text style={styles.errorText}>{errors.passwordConfirm}</Text>}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading || !isFormValid}
                  activeOpacity={0.8}
                  style={styles.buttonContainer}
                >
                  <LinearGradient
                    colors={!isFormValid || isLoading ? ['#E0E0E0', '#BDBDBD'] : PINK_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.signInButton}
                  >
                    {isLoading ? (
                      <View style={styles.loadingRow}>
                        <ActivityIndicator color="#FFFFFF" size="small" />
                        <Text style={styles.loadingText}>Creando cuenta...</Text>
                      </View>
                    ) : (
                      <Text style={styles.signInButtonText}>Registrarme</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.footerLinkContainer}>
                  <Text style={styles.footerLinkText}>¿Ya tienes cuenta? </Text>
                  <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                    <Text style={styles.footerLinkHighlight}>Inicia sesión</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  innerContainer: {
    paddingVertical: spacing.xl,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: Platform.OS === 'ios' ? spacing.xl : 0,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: spacing.xs,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: spacing.xxl,
  },
  formContainer: {
    gap: spacing.lg,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 4,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  typeCardSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  signInButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  footerLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLinkHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
