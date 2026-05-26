/**
 * Report Screen - Multi-Step Fast Reporting
 * Uber-like experience: Fast, clean, intuitive
 * Step 1: Animal Type → Step 2: Condition → Step 3: Photo → Step 4: Location + Notes → Step 5: Submit
 */

import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { API_URL } from '@/src/config/api';
import { useAuthStore } from '@/src/store/authStore';
import { colors, spacing } from '@/src/theme';

type AnimalType = 'Perro' | 'Gato' | 'Pajaro' | 'Roedor' | 'Otro';
type AnimalCondition = 'Herido' | 'Abandonado' | 'En peligro' | 'Perdido' | 'Hambriento';
type Step = 1 | 2 | 3 | 4 | 5;

const ANIMAL_TYPES = [
  { id: 'Perro', emoji: '🐕', label: 'Perro' },
  { id: 'Gato', emoji: '🐈', label: 'Gato' },
  { id: 'Pajaro', emoji: '🐦', label: 'Pájaro' },
  { id: 'Roedor', emoji: '🐿️', label: 'Roedor' },
  { id: 'Otro', emoji: '🦌', label: 'Otro' },
];

const ANIMAL_CONDITIONS = [
  { id: 'Herido', emoji: '🩹', label: 'Herido', urgency: 'high' },
  { id: 'Abandonado', emoji: '📦', label: 'Abandonado', urgency: 'medium' },
  { id: 'En peligro', emoji: '⚠️', label: 'En peligro', urgency: 'high' },
  { id: 'Perdido', emoji: '❓', label: 'Perdido', urgency: 'medium' },
  { id: 'Hambriento', emoji: '🍖', label: 'Hambriento', urgency: 'low' },
];

const PINK = '#FF3E88';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    animalType: '' as AnimalType | '',
    condition: '' as AnimalCondition | '',
    photo: null as string | null,
    notes: '',
    address: '',
  });

  // GPS Helper
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para marcar el punto exacto del rescate.'
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No pudimos obtener tu ubicación actual.');
      return null;
    }
  };

  // Step 1: Animal Type
  const handleAnimalTypeSelect = (type: AnimalType) => {
    setFormData({ ...formData, animalType: type });
    setCurrentStep(2);
  };

  // Step 2: Condition
  const handleConditionSelect = (condition: AnimalCondition) => {
    setFormData({ ...formData, condition });
    setCurrentStep(3);
  };

  // Step 3: Add Photo
  const handleAddPhoto = () => {
    // TODO: Integrate with expo-image-picker
    const mockImageUri = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0Y0OEZCMSIvPjwvc3ZnPg==`;
    setFormData({ ...formData, photo: mockImageUri });
    setCurrentStep(4);
  };

  // Step 4: Skip to Submit or go to notes
  const handleGoToSubmit = () => {
    if (!formData.address.trim()) {
      Alert.alert('Ubicación requerida', 'Por favor indica dónde viste el animal');
      return;
    }
    setCurrentStep(5);
  };

  // Step 5: Submit
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // 1. Get current GPS Location
      const coords = await getLocation();
      if (!coords) {
        setIsLoading(false);
        return;
      }

      // 2. Prepare Payload for Backend
      const currentToken = useAuthStore.getState().token;
      
      // 2.1 Validate Description (10-1000 chars)
      let finalDescription = formData.notes.trim();
      if (finalDescription.length === 0) {
        finalDescription = "Animal en situación de riesgo, requiere atención urgente";
      } else if (finalDescription.length < 10) {
        Alert.alert(
          'Descripción muy corta', 
          'Por favor, describe mejor la situación (mínimo 10 caracteres).'
        );
        setIsLoading(false);
        return;
      }

      const payload = {
        title: `${formData.animalType} en ${formData.condition}`,
        description: finalDescription,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: formData.address || 'Ubicación no especificada',
        animalType: formData.animalType,
        animalCondition: formData.condition,
        animalDescription: finalDescription,
      };

      console.log('FINAL PAYLOAD:', payload);

      // 3. API Request
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('REPORT RESPONSE:', data);

      if (response.ok) {
        Alert.alert('¡Éxito! 🎉', 'Tu reporte fue creado. Voluntarios ya están viendo tu caso.');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear el reporte');
      }
    } catch (error) {
      console.error('SUBMIT ERROR:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      // STEP 1: Animal Type
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>¿Qué animal viste?</Text>
              <Text style={styles.stepSubtitle}>Selecciona el tipo</Text>
            </View>

            <View style={styles.animalGrid}>
              {ANIMAL_TYPES.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={[
                    styles.animalCard,
                    formData.animalType === animal.id && styles.animalCardActive,
                  ]}
                  onPress={() => handleAnimalTypeSelect(animal.id as AnimalType)}
                >
                  <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                  <Text style={styles.animalLabel}>{animal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      // STEP 2: Condition
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>¿Cuál es su condición?</Text>
              <Text style={styles.stepSubtitle}>Selecciona lo que mejor describe</Text>
            </View>

            <View style={styles.conditionList}>
              {ANIMAL_CONDITIONS.map((cond) => (
                <TouchableOpacity
                  key={cond.id}
                  style={[
                    styles.conditionButton,
                    formData.condition === cond.id && styles.conditionButtonActive,
                  ]}
                  onPress={() => handleConditionSelect(cond.id as AnimalCondition)}
                >
                  <View style={styles.conditionLeft}>
                    <Text style={styles.conditionEmoji}>{cond.emoji}</Text>
                    <Text style={styles.conditionLabel}>{cond.label}</Text>
                  </View>
                  {formData.condition === cond.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={PINK}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      // STEP 3: Photo
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Agregar foto</Text>
              <Text style={styles.stepSubtitle}>Ayuda a los rescatistas a identificar</Text>
            </View>

            {!formData.photo ? (
              <View style={styles.photoUploadContainer}>
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={64}
                  color={PINK}
                />
                <Text style={styles.photoUploadText}>Toma o selecciona una foto</Text>
              </View>
            ) : (
              <View style={styles.photoPreview}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={48}
                  color={PINK}
                />
                <Text style={styles.photoPreviewText}>Foto cargada</Text>
              </View>
            )}

            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity
                style={[styles.photoButton, !formData.photo && styles.photoButtonPrimary]}
                onPress={handleAddPhoto}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={20}
                  color={formData.photo ? colors.textPrimary : colors.textInverse}
                />
                <Text
                  style={[
                    styles.photoButtonText,
                    !formData.photo && { color: colors.textInverse },
                  ]}
                >
                  Tomar Foto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoButton, !formData.photo && styles.photoButtonPrimary]}
                onPress={handleAddPhoto}
              >
                <MaterialCommunityIcons
                  name="image"
                  size={20}
                  color={formData.photo ? colors.textPrimary : colors.textInverse}
                />
                <Text
                  style={[
                    styles.photoButtonText,
                    !formData.photo && { color: colors.textInverse },
                  ]}
                >
                  Galería
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => setCurrentStep(4)}
            >
              <Text style={styles.skipButtonText}>Continuar sin foto</Text>
            </TouchableOpacity>
          </View>
        );

      // STEP 4: Location + Notes
      case 4:
        return (
          <ScrollView style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Ubicación y notas</Text>
              <Text style={styles.stepSubtitle}>¿Dónde viste el animal?</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Dirección o zona</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={PINK}
                  style={{ marginRight: spacing.sm }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ej: Plaza de Armas, cerca del banco"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Notas adicionales (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Color, tamaño, comportamiento, etc."
                placeholderTextColor={colors.textTertiary}
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        );

      // STEP 5: Review & Submit
      case 5:
        const selectedAnimal = ANIMAL_TYPES.find(
          (a) => a.id === formData.animalType
        );
        const selectedCondition = ANIMAL_CONDITIONS.find(
          (c) => c.id === formData.condition
        );

        return (
          <ScrollView style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>¿Todo correcto?</Text>
              <Text style={styles.stepSubtitle}>Revisa antes de enviar</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Animal</Text>
                <View style={styles.summaryValue}>
                  <Text style={styles.summaryEmoji}>
                    {selectedAnimal?.emoji}
                  </Text>
                  <Text style={styles.summaryText}>{selectedAnimal?.label}</Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Condición</Text>
                <View style={styles.summaryValue}>
                  <Text style={styles.summaryEmoji}>
                    {selectedCondition?.emoji}
                  </Text>
                  <Text style={styles.summaryText}>
                    {selectedCondition?.label}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ubicación</Text>
                <Text style={styles.summaryText} numberOfLines={1}>
                  {formData.address}
                </Text>
              </View>
            </View>

            {formData.photo && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Foto</Text>
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={PINK}
                  />
                </View>
              </View>
            )}

            {formData.notes && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Notas</Text>
                </View>
                <Text style={styles.summaryNotesText}>{formData.notes}</Text>
              </View>
            )}

            <View style={{ height: spacing.lg }} />
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                step <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepCounter}>
          {currentStep}/5
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {currentStep < 5 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              if (currentStep === 3) {
                setCurrentStep(4);
              } else if (currentStep === 4) {
                handleGoToSubmit();
              }
            }}
            disabled={
              (currentStep === 1 && !formData.animalType) ||
              (currentStep === 2 && !formData.condition) ||
              (currentStep === 4 && !formData.address)
            }
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Revisar' : 'Siguiente'}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.textInverse}
            />
          </TouchableOpacity>
        ) : (
          <Button
            label="🚨 Reportar Salvita"
            onPress={handleSubmit}
            isLoading={isLoading}
            fullWidth
            size="large"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },

  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },

  progressDotActive: {
    backgroundColor: PINK,
  },

  stepCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: PINK,
    minWidth: 30,
    textAlign: 'right',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  stepContainer: {
    flex: 1,
  },

  stepHeader: {
    marginBottom: spacing.xl,
  },

  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // STEP 1: Animal Grid
  animalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  animalCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },

  animalCardActive: {
    borderColor: PINK,
    backgroundColor: '#fff0f7',
  },

  animalEmoji: {
    fontSize: 40,
  },

  animalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // STEP 2: Condition List
  conditionList: {
    gap: spacing.md,
  },

  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },

  conditionButtonActive: {
    borderColor: PINK,
    backgroundColor: '#fff0f7',
  },

  conditionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  conditionEmoji: {
    fontSize: 28,
  },

  conditionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // STEP 3: Photo
  photoUploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: PINK,
    backgroundColor: '#fff0f7',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  photoPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },

  photoUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: PINK,
  },

  photoPreviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  photoButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },

  photoButtonPrimary: {
    backgroundColor: PINK,
    borderColor: PINK,
  },

  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  skipButton: {
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // STEP 4: Location + Notes
  formSection: {
    marginBottom: spacing.xl,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
  },

  textarea: {
    paddingHorizontal: spacing.md,
    textAlignVertical: 'top',
    minHeight: 80,
  },

  // STEP 5: Summary
  summaryCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },

  summaryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  summaryEmoji: {
    fontSize: 24,
  },

  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  summaryNotesText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },

  // Bottom Actions
  bottomActions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.bgPrimary,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    backgroundColor: PINK,
    gap: spacing.sm,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
});