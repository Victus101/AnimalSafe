/**
 * Home Screen - Map as Protagonist
 * Figma Design Implementation
 * Search + Stats Card + Interactive Map + Report Button
 */
import { API_URL } from '../../src/config/api';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing } from '../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

export default function HomeScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      console.log('REPORTS DATA RECEIVED:', data);

      if (!Array.isArray(data)) {
        console.error('EXPECTED ARRAY BUT GOT:', typeof data);
        setReports([]);
        return;
      }

      // Enrich data for UI - Using nested location
      const enriched = data.map((r: any) => ({
        ...r,
        emoji: getEmoji(r.animalType),
        urgency: getUrgency(r.animalCondition),
        condition: r.animalCondition,
        address: r.location?.address || 'Ubicación no especificada',
        latitude: r.location?.latitude,
        longitude: r.location?.longitude,
        createdAt: 'reciente',
        distance: '??',
      }));
      
      setReports(enriched);
    } catch (error) {
      console.error('FETCH REPORTS ERROR:', error);
      setReports([]);
    }
  };

  const [region, setRegion] = useState({
    latitude: -33.4489,
    longitude: -70.6693,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    fetchReports();

    const getLocation = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') return;

      const location =
        await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    };

    getLocation();
  }, []);

  const handleReportPress = () => {
    router.push('/report');
  };

  const handleMarkerPress = (item: any) => {
    setSelectedCase(item);
  };

  const handleCloseCard = () => {
    setSelectedCase(null);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'map' ? 'list' : 'map');
    setSelectedCase(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* CONTENT AREA */}
      {viewMode === 'list' ? (
        <ScrollView style={styles.listView} contentContainerStyle={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Casos Activos</Text>
            <Text style={styles.listSubtitle}>{reports.length} animales necesitan ayuda cerca de ti</Text>
          </View>
          
          {reports.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => {
                router.push(`/case-detail?id=${item.id}`);
              }}
            >
              <Text style={styles.listItemEmoji}>{item.emoji}</Text>
              <View style={styles.listItemTextContainer}>
                <View style={styles.listItemHeader}>
                  <Text style={styles.listItemTitle} numberOfLines={1}>{item.title}</Text>
                  {item.urgency === 'high' && (
                    <View style={styles.urgentBadgeMicro}>
                      <Text style={styles.urgentTextMicro}>URGENTE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.listItemSubtitle}>{item.animalType} • {item.animalCondition}</Text>
                <Text style={styles.listItemLocation}>{item.address}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        /* MAIN MAP AREA - PROTAGONIST */
        <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.mapContent}>
            <View style={styles.mapBackground} />

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>🗺️ Mapa disponible en móvil</Text>
              <Text style={{ marginTop: 10 }}>
                Usa Android o iPhone para ver mapa real
              </Text>
              {/* Web fallback list */}
              <View style={{ marginTop: 20, width: '100%', paddingHorizontal: 20 }}>
                {reports.map(item => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' }}
                    onPress={() => handleMarkerPress(item)}
                  >
                    <Text>{item.emoji} {item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <MapView
            style={StyleSheet.absoluteFillObject}
            region={region}
            showsUserLocation
            showsMyLocationButton
            onPress={() => setSelectedCase(null)}
          >
            {(() => {
              const validReports = reports.filter(
                (item) =>
                  item.location &&
                  item.location.latitude !== null &&
                  item.location.longitude !== null &&
                  !isNaN(Number(item.location.latitude)) &&
                  !isNaN(Number(item.location.longitude))
              );
              
              console.log(`RENDERED MARKERS: ${validReports.length} of ${reports.length}`);

              return validReports.map((item) => (
                <Marker
                  key={item.id}
                  coordinate={{
                    latitude: Number(item.location.latitude),
                    longitude: Number(item.location.longitude),
                  }}
                  onPress={() => handleMarkerPress(item)}
                >
                  <View style={[
                    styles.customMarker,
                    item.urgency === 'high' ? styles.markerUrgent : styles.markerMedium
                  ]}>
                    <Text style={styles.markerEmoji}>{item.emoji}</Text>
                  </View>
                </Marker>
              ));
            })()}
          </MapView>
        )}
      </View>
      )}

      {/* Search Bar + Filter - OVERLAY ON TOP */}
      <View style={styles.headerSection}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors.textTertiary}
          />
        </View>
        <TouchableOpacity style={styles.viewToggle} onPress={toggleViewMode}>
          <MaterialCommunityIcons
            name={viewMode === 'map' ? "format-list-bulleted" : "map-outline"}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Case Detail Card Overlay */}
      {selectedCase && (
        <View style={styles.detailCardOverlay}>
          <TouchableOpacity 
            style={styles.detailCard} 
            activeOpacity={1}
            onPress={() => {}} // Prevent bubbling
          >
            <View style={styles.cardHeader}>
              <View style={styles.urgencyBadgeSmall}>
                <Text style={styles.urgencyTextSmall}>
                  {selectedCase.urgency === 'high' ? '🚨 URGENTE' : '⏳ MEDIA'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleCloseCard}>
                <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardMainInfo}>
                <Text style={styles.cardEmoji}>{selectedCase.emoji}</Text>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{selectedCase.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {selectedCase.animalType} • {selectedCase.condition}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardDescription} numberOfLines={2}>
                {selectedCase.description}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.locationInfo}>
                  <MaterialCommunityIcons name="map-marker" size={14} color={colors.primary} />
                  <Text style={styles.locationText}>{selectedCase.distance} km • {selectedCase.createdAt}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.helpButton}
                  onPress={() => {
                    handleCloseCard();
                    router.push(`/case-detail?id=${selectedCase.id}`);
                  }}
                >
                  <Text style={styles.helpButtonText}>Ver Detalles</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* "Reportar Salvita" Floating Button */}
      {!selectedCase && (
        <View style={styles.reportButtonWrapper}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleReportPress}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons
              name="heart-plus"
              size={24}
              color={colors.textInverse}
              style={styles.reportButtonIcon}
            />
            <Text style={styles.reportButtonText}>Reportar Salvita</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Spacing for Nav */}
      <View style={styles.bottomSpacer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  // Search Bar + Filter Section
 headerSection:{
  position:'absolute',
  top:60,
  left:16,
  right:16,
  zIndex:999,
  flexDirection: 'row',
  gap: spacing.sm,
},

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  searchIcon: {
    marginRight: spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginLeft: spacing.sm,
  },

  // List View Styles
  listView: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    marginTop: 160, // To avoid header
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },

  listHeader: {
    marginBottom: spacing.lg,
  },

  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  listSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  listItemEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  listItemTextContainer: {
    flex: 1,
    gap: 2,
  },

  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },

  listItemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  listItemLocation: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  urgentBadgeMicro: {
    backgroundColor: '#FFE5EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  urgentTextMicro: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.error,
  },

  // Active Rescues Stats Card
statsCard: {
  marginHorizontal: spacing.lg,
  marginTop: spacing.sm,
  marginBottom: spacing.sm,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: colors.bgSecondary,
  borderRadius: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: colors.borderLight,
},

  statsNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 32,
  },

  statsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },

  urgentBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  urgentBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },

  // MAP AREA - PROTAGONIST
mapContainer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

  mapContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },

  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f4fb',
  },

  // Map Markers Container
  mapMarkersArea: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },

  // Individual marker positions (distributed across the map)
  markerPosition1: {
    position: 'absolute',
    top: '15%',
    right: '15%',
  },

  markerPosition2: {
    position: 'absolute',
    top: '35%',
    left: '20%',
  },

  markerPosition3: {
    position: 'absolute',
    top: '50%',
    right: '30%',
  },

  markerPosition4: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
  },

  markerPosition5: {
    position: 'absolute',
    bottom: '15%',
    right: '25%',
  },

  // Map Markers
  marker: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.bgPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  customMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.bgPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  markerUrgent: {
    backgroundColor: colors.error,
  },

  markerMedium: {
    backgroundColor: colors.accent,
  },

  markerUser: {
    backgroundColor: colors.info,
  },

  markerEmoji: {
    fontSize: 22,
  },

  // Detail Card
  detailCardOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 20,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 200,
  },

  detailCard: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  urgencyBadgeSmall: {
    backgroundColor: '#FFE5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  urgencyTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.error,
  },

  cardContent: {
    gap: spacing.sm,
  },

  cardMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  cardEmoji: {
    fontSize: 40,
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginVertical: spacing.xs,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  locationText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },

  helpButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },

  helpButtonText: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Report Button - Floating above bottom nav
  reportButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 12,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 150,
  },

  reportButton: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 28,
    backgroundColor: '#FF3E88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5FA2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 24,
   
  },

  reportButtonIcon: {
    marginRight: spacing.sm,
  },

  reportButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.textInverse,
    letterSpacing: 0.3,
  },

  // Bottom Spacer - For Nav
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: colors.bgPrimary,
  },
});
