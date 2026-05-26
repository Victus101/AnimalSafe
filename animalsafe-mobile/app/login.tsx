/**
 * Login Screen - AnimalSafe Mobile
 * Beautiful premium minimal design with soft pastel aesthetics
 * Ready for backend JWT integration
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

const SOFT_BG = '#FDF8F9'; // Even softer pinkish white
const PINK_GRADIENT: [string, string] = ['#F48FB1', '#EC407A'];

export default function LoginScreen() {
  const router = useRouter();
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Local state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const isFormValid = email.includes('@') && password.length >= 6;

  // Auth store
  const { setIsLoading: setStoreLoading, setError } = useAuthStore();

  // Validation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!email.includes('@')) {
      newErrors.email = 'Introduce un correo válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleLogin = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  setStoreLoading(true);
  setError('');

  try {
    console.log('🚀 LOGIN DEBUG_IP:', `${API_URL}/api/auth/login`);
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = 'Correo o contraseña incorrectos';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return;
    }

    // 🔥 Guardar usuario real
    console.log('USER SAVED (LOGIN):', data.user);
    useAuthStore.getState().setUser(data.user);

    // 🔥 Guardar token real
    useAuthStore.getState().setToken(data.token);

    // 🔥 Navegar
    router.replace('/(tabs)');

  } catch (error) {
    console.log(error);
    const errorMessage = 'Error de conexión con el servidor';
    setError(errorMessage);
    Alert.alert('Error', errorMessage);
  } finally {
    setIsLoading(false);
    setStoreLoading(false);
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
            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoShadow}>
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons
                    name="paw"
                    size={42}
                    color={colors.primary}
                  />
                </View>
              </View>
              <Text style={styles.appTitle}>AnimalSafe</Text>
              <Text style={styles.appSubtitle}>Cada vida cuenta 🐾</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.welcomeTitle}>¡Hola de nuevo!</Text>
              <Text style={styles.welcomeSubtitle}>Ingresa tus datos para continuar</Text>

              <View style={styles.formContainer}>
                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <StyledTextInput
                    ref={emailRef}
                    icon="email-outline"
                    placeholder="ejemplo@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    error={errors.email}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Recuperar', 'Próximamente...')}>
                      <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                  </View>
                  <StyledTextInput
                    ref={passwordRef}
                    icon="lock-outline"
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    showPasswordToggle
                    isPasswordVisible={showPassword}
                    onPasswordToggle={setShowPassword}
                    error={errors.password}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={handleLogin}
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
                        <ActivityIndicator color={colors.textInverse} size="small" />
                        <Text style={styles.loadingText}>Conectando...</Text>
                      </View>
                    ) : (
                      <Text style={styles.signInButtonText}>Entrar</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Register Link */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpTextNormal}>¿No tienes cuenta? </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/register')}
                    disabled={isLoading}
                  >
                    <Text style={styles.signUpTextHighlight}>Regístrate</Text>
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
    justifyContent: 'center',
  },
  innerContainer: {
    paddingVertical: spacing.xxl,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: spacing.md,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-10deg' }],
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.xl,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
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
    letterSpacing: 0.5,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signUpTextNormal: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  signUpTextHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

