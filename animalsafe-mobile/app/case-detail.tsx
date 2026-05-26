/**
 * Case Detail Screen - Full case view with comments
 * Shows: Reporter info, description, comments, action buttons
 */
import { API_URL } from '../src/config/api';
import { colors, spacing } from '../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Helpers to map backend data to UI
const getEmoji = (type: string) => {
  const t = type?.toUpperCase();
  if (t === 'PERRO') return '🐕';
  if (t === 'GATO') return '🐈';
  if (t === 'PAJARO') return '🐦';
  if (t === 'ROEDOR') return '🐿️';
  return '🐾';
};

const getUrgency = (condition: string) => {
  const c = condition?.toUpperCase();
  if (c === 'HERIDO' || c === 'EN PELIGRO') return 'high';
  return 'medium';
};

// Mock comments for now
const mockComments = [
  {
    id: 1,
    author: 'Pedro Ruiz',
    avatar: '👨‍🌾',
    text: 'Yo lo vi hace una hora cerca del Juanín Juan, seguía en la misma posición',
    timestamp: 'hace 30 mins',
    likes: 5,
  },
  {
    id: 2,
    author: 'Sofía Martínez',
    avatar: '👩‍⚕️',
    text: 'Si alguien puede ayudar, conozco un veterinario cerca que podría revisar',
    timestamp: 'hace 1 hora',
    likes: 12,
  },
];

export default function CaseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [hasHelped, setHasHelped] = useState(false);

  useEffect(() => {
    fetchCaseDetail();
  }, [id]);

  const fetchCaseDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reports/${id}`);
      const data = await response.json();
      
      // Enrich data for UI
      const enriched = {
        ...data,
        emoji: getEmoji(data.animalType),
        urgency: getUrgency(data.animalCondition),
        animalType: data.animalType,
        condition: data.animalCondition,
        createdAt: 'reciente',
        distance: '??',
        reporter: { name: 'Comunidad', avatar: '🐾', verified: true }
      };
      
      setCaseData(enriched);
    } catch (error) {
      console.error('FETCH DETAIL ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!caseData) {
    return (
      <View style={styles.safeArea}>
        <View style={[styles.errorContainer, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.errorText}>Caso no encontrado</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        author: 'Yo',
        avatar: '👤',
        text: newComment,
        timestamp: 'Ahora',
        likes: 0,
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    }
  };

  const handleHelpPressed = () => {
    setHasHelped(!hasHelped);
    // TODO: POST to API /api/reports/{id}/help or similar
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons 
              name="chevron-left" 
              size={28} 
              color={colors.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Caso</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {/* Case Header Card */}
          <View style={styles.caseCard}>
            {/* Status Badge */}
            <View style={styles.statusRow}>
              <View style={[
                styles.statusBadge,
                caseData.urgency === 'high' ? styles.statusHigh : styles.statusMedium
              ]}>
                <Text style={styles.statusText}>
                  {caseData.urgency === 'high' ? '🚨 URGENTE' : '⏳ MEDIA'}
                </Text>
              </View>
              <Text style={styles.timeCreated}>{caseData.createdAt}</Text>
            </View>

            {/* Main Info */}
            <View style={styles.mainInfo}>
              <Text style={styles.emoji}>{caseData.emoji}</Text>
              <View style={styles.infoText}>
                <Text style={styles.caseTitle} numberOfLines={2}>{caseData.title}</Text>
                <Text style={styles.caseType}>
                  {caseData.animalType} • {caseData.condition}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.locationRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={18} 
                color={colors.primary} 
              />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.address}>{caseData.address}</Text>
                <Text style={styles.distance}>{caseData.distance} km de distancia</Text>
              </View>
            </View>
          </View>

          {/* Reporter Info */}
          <View style={styles.reporterCard}>
            <Text style={styles.sectionTitle}>Reportado por</Text>
            <View style={styles.reporterInfo}>
              <Text style={styles.reporterAvatar}>{caseData.reporter.avatar}</Text>
              <View style={styles.reporterText}>
                <View style={styles.reporterNameRow}>
                  <Text style={styles.reporterName}>{caseData.reporter.name}</Text>
                  {caseData.reporter.verified && (
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={16} 
                      color={colors.info} 
                    />
                  )}
                </View>
                <Text style={styles.reporterBadge}>
                  {caseData.reporter.verified ? 'Usuario Verificado' : 'Usuario Nuevo'}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{caseData.description}</Text>
          </View>

          {/* Help Button */}
          <TouchableOpacity
            style={[
              styles.helpButton,
              hasHelped ? styles.helpButtonActive : {}
            ]}
            onPress={handleHelpPressed}
          >
            <MaterialCommunityIcons
              name={hasHelped ? "heart" : "heart-outline"}
              size={20}
              color={hasHelped ? colors.textInverse : colors.primary}
            />
            <Text style={[
              styles.helpButtonText,
              hasHelped ? styles.helpButtonTextActive : {}
            ]}>
              {hasHelped ? 'Ofrezco Ayuda ✓' : 'Ofrezco Ayuda'}
            </Text>
          </TouchableOpacity>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comentarios ({comments.length})
            </Text>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Agrega un comentario..."
                placeholderTextColor={colors.textTertiary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !newComment.trim() ? styles.sendButtonDisabled : {}
                ]}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={18}
                  color={newComment.trim() ? colors.primary : colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentAvatar}>{comment.avatar}</Text>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTime}>{comment.timestamp}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <View style={styles.commentFooter}>
                    <TouchableOpacity style={styles.commentLike}>
                      <MaterialCommunityIcons
                        name="heart-outline"
                        size={14}
                        color={colors.textTertiary}
                      />
                      <Text style={styles.commentLikeCount}>{comment.likes}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  errorButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },

  errorButtonText: {
    color: colors.textInverse,
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  content: {
    flex: 1,
  },

  contentInner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Case Card
  caseCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },

  statusHigh: {
    backgroundColor: '#FFE5EE',
  },

  statusMedium: {
    backgroundColor: '#FFF3E0',
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.error,
  },

  timeCreated: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  mainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  emoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },

  infoText: {
    flex: 1,
    gap: 4,
  },

  caseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  caseType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  address: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  distance: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Reporter Card
  reporterCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  reporterAvatar: {
    fontSize: 40,
  },

  reporterText: {
    flex: 1,
    gap: 4,
  },

  reporterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  reporterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  reporterBadge: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  // Description
  descriptionCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  // Help Button
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  helpButtonActive: {
    backgroundColor: colors.primary,
  },

  helpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },

  helpButtonTextActive: {
    color: colors.textInverse,
  },

  // Comments
  commentsSection: {
    marginBottom: spacing.xl,
  },

  commentInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  commentInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgPrimary,
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  commentItem: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  commentAvatar: {
    fontSize: 32,
  },

  commentContent: {
    flex: 1,
    gap: 4,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  commentTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  commentFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },

  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  commentLikeCount: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
