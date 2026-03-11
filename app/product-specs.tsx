import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Search, X, ChevronDown, ChevronUp, Info, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useResponsive } from '@/hooks/useResponsive';
import { chainSpecs, chainSpecGroups, chainApplications, chainBuyLinks } from '@/mocks/chainSpecs';
import type { ChainSpec } from '@/mocks/chainSpecs';

type TabKey = 'specs' | 'applications';

const SEAL_COLORS: Record<string, string> = {
  'X': Colors.primary,
  'O': Colors.chainGold,
  'N/A': Colors.textMuted,
};

const SEAL_LABELS: Record<string, string> = {
  'X': 'X-Ring',
  'O': 'O-Ring',
  'N/A': 'Non-Sealed',
};

function getSealBadge(seal: string) {
  return {
    color: SEAL_COLORS[seal] ?? Colors.textMuted,
    label: SEAL_LABELS[seal] ?? seal,
  };
}

function ChainSpecCard({ spec, isTablet }: { spec: ChainSpec; isTablet: boolean }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const animValue = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    Animated.timing(animValue, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  }, [expanded, animValue]);

  const sealBadge = getSealBadge(spec.seal);

  const maxHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={toggle}
      style={[styles.specCard, isTablet && styles.specCardTablet]}
    >
      <View style={styles.specCardHeader}>
        <View style={styles.specCardTitleRow}>
          <Text style={[styles.specChainName, isTablet && { fontSize: 18 }]}>{spec.chain}</Text>
          <View style={[styles.sealBadge, { borderColor: sealBadge.color }]}>
            <Text style={[styles.sealBadgeText, { color: sealBadge.color }]}>{sealBadge.label}</Text>
          </View>
        </View>
        <View style={styles.specCardMeta}>
          <Text style={styles.specCategory}>{spec.category}</Text>
          <Text style={styles.specMaxCC}>Up to {spec.maxCC}cc</Text>
        </View>
        <View style={styles.specCardQuickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatLabel}>Tensile</Text>
            <Text style={styles.quickStatValue}>{spec.tensileStrength.toLocaleString()} lbs</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatLabel}>Weight</Text>
            <Text style={styles.quickStatValue}>{spec.weight} lbs</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatLabel}>Life Index</Text>
            <Text style={styles.quickStatValue}>{spec.chainLifeIndex.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.expandIndicator}>
          {expanded ? (
            <ChevronUp size={16} color={Colors.textMuted} />
          ) : (
            <ChevronDown size={16} color={Colors.textMuted} />
          )}
        </View>
      </View>

      <Animated.View style={[styles.specCardDetails, { maxHeight, opacity: animValue }]}>
        <View style={styles.detailDivider} />
        <View style={styles.detailGrid}>
          <DetailRow label="Pin Length" value={`${spec.pinLength}" `} />
          <DetailRow label="Pin Diameter" value={`${spec.pinDia}" `} />
          <DetailRow label="Plate (IN)" value={`${spec.plateThicknessIn} mm`} />
          <DetailRow label="Plate (OUT)" value={`${spec.plateThicknessOut} mm`} />
        </View>
        <Text style={styles.masterLinkHeader}>Master Link Options</Text>
        <View style={styles.masterLinkRow}>
          <MasterLinkBadge type="ZJ" value={spec.masterLinkZJ} />
          <MasterLinkBadge type="FJ" value={spec.masterLinkFJ} />
          <MasterLinkBadge type="RJ" value={spec.masterLinkRJ} />
        </View>
        {spec.buyUrl ? (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => Linking.openURL(spec.buyUrl)}
            activeOpacity={0.7}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
            <ExternalLink size={13} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function MasterLinkBadge({ type, value }: { type: string; value: string }) {
  const isIncluded = value === 'Included' || value === '(XJ)';
  const isOption = value === 'Option';

  return (
    <View style={[
      styles.masterLinkBadge,
      isIncluded && styles.masterLinkIncluded,
      isOption && styles.masterLinkOption,
    ]}>
      <Text style={[
        styles.masterLinkType,
        isIncluded && { color: Colors.success },
        isOption && { color: Colors.chainGold },
      ]}>{type}</Text>
      <Text style={[
        styles.masterLinkValue,
        isIncluded && { color: Colors.success },
        isOption && { color: Colors.chainGold },
      ]}>{value}</Text>
    </View>
  );
}

function ApplicationSection({ category, chains }: { category: string; chains: { chain: string; maxCC: number; buyUrl: string }[] }) {
  return (
    <View style={styles.appSection}>
      <Text style={styles.appCategoryTitle}>{category}</Text>
      <View style={styles.appChainList}>
        {chains.map((item) => (
          <View key={item.chain} style={styles.appChainRow}>
            <View style={styles.appChainInfo}>
              <Text style={styles.appChainName}>{item.chain}</Text>
              <View style={styles.appCCBadge}>
                <Text style={styles.appCCText}>Up to {item.maxCC.toLocaleString()}cc</Text>
              </View>
            </View>
            {item.buyUrl ? (
              <TouchableOpacity
                style={styles.buyButtonSmall}
                onPress={() => Linking.openURL(item.buyUrl)}
                activeOpacity={0.7}
              >
                <Text style={styles.buyButtonSmallText}>Buy Now</Text>
                <ExternalLink size={11} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProductSpecsScreen() {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabKey>('specs');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    chainSpecGroups.forEach(g => { initial[g] = true; });
    return initial;
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredSpecs = useMemo(() => {
    if (!searchQuery.trim()) return chainSpecs;
    const q = searchQuery.toLowerCase().trim();
    return chainSpecs.filter(s =>
      s.chain.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q) ||
      s.seal.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedSpecs = useMemo(() => {
    const groups: Record<string, ChainSpec[]> = {};
    chainSpecGroups.forEach(g => { groups[g] = []; });
    filteredSpecs.forEach(s => {
      if (groups[s.group]) {
        groups[s.group].push(s);
      }
    });
    return groups;
  }, [filteredSpecs]);

  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return chainApplications;
    const q = searchQuery.toLowerCase().trim();
    return chainApplications.filter(a =>
      a.chain.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedApplications = useMemo(() => {
    const groups: Record<string, { chain: string; maxCC: number; buyUrl: string }[]> = {};
    filteredApplications.forEach(a => {
      if (!groups[a.category]) groups[a.category] = [];
      groups[a.category].push({ chain: a.chain, maxCC: a.maxCC, buyUrl: a.buyUrl });
    });
    return groups;
  }, [filteredApplications]);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  }, []);

  const resultCount = activeTab === 'specs' ? filteredSpecs.length : filteredApplications.length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Product Lineup',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' as const, fontSize: responsive.isTablet ? 20 : 17 },
        }}
      />
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
        <View style={[
          styles.searchSection,
          { paddingHorizontal: responsive.horizontalPadding },
          responsive.isTablet && { alignItems: 'center' as const },
        ]}>
          <View style={[
            styles.searchWrap,
            responsive.isTablet && { maxWidth: responsive.contentMaxWidth, width: '100%' as unknown as number },
          ]}>
            <View style={styles.searchBar}>
              <Search size={18} color={Colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { fontSize: responsive.fontSize.body }]}
                placeholder="Search chains, categories..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
                testID="spec-search-input"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {searchQuery.length > 0 && (
              <Text style={styles.resultCount}>{resultCount} result{resultCount !== 1 ? 's' : ''}</Text>
            )}
          </View>
        </View>

        <View style={[
          styles.tabRow,
          { paddingHorizontal: responsive.horizontalPadding },
          responsive.isTablet && { alignItems: 'center' as const },
        ]}>
          <View style={[
            styles.tabContainer,
            responsive.isTablet && { maxWidth: responsive.contentMaxWidth, width: '100%' as unknown as number },
          ]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'specs' && styles.tabActive]}
              onPress={() => setActiveTab('specs')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'specs' && styles.tabTextActive]}>Chain Specs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'applications' && styles.tabActive]}
              onPress={() => setActiveTab('applications')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'applications' && styles.tabTextActive]}>Applications</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: responsive.horizontalPadding,
              paddingBottom: insets.bottom + 24,
            },
            responsive.isTablet && { alignItems: 'center' as const },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[
            styles.contentWrapper,
            responsive.isTablet && { maxWidth: responsive.contentMaxWidth, width: '100%' as unknown as number },
          ]}>
            {activeTab === 'specs' ? (
              <>
                <View style={styles.legendRow}>
                  <Info size={14} color={Colors.textMuted} />
                  <Text style={styles.legendText}>Tap a chain to see full specifications</Text>
                </View>
                {chainSpecGroups.map(group => {
                  const specs = groupedSpecs[group];
                  if (!specs || specs.length === 0) return null;
                  const isExpanded = expandedGroups[group] ?? true;
                  return (
                    <View key={group} style={styles.specGroup}>
                      <TouchableOpacity
                        style={styles.groupHeader}
                        onPress={() => toggleGroup(group)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.groupHeaderLeft}>
                          <View style={styles.groupAccent} />
                          <Text style={[styles.groupTitle, { fontSize: responsive.fontSize.sectionTitle }]}>{group}</Text>
                        </View>
                        <View style={styles.groupHeaderRight}>
                          <Text style={styles.groupCount}>{specs.length}</Text>
                          {isExpanded ? (
                            <ChevronUp size={18} color={Colors.textSecondary} />
                          ) : (
                            <ChevronDown size={18} color={Colors.textSecondary} />
                          )}
                        </View>
                      </TouchableOpacity>
                      {isExpanded && (
                        <View style={styles.specCardList}>
                          {specs.map(spec => (
                            <ChainSpecCard key={spec.chain} spec={spec} isTablet={responsive.isTablet} />
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
                {filteredSpecs.length === 0 && (
                  <View style={styles.emptyState}>
                    <Search size={40} color={Colors.textMuted} />
                    <Text style={styles.emptyTitle}>No chains found</Text>
                    <Text style={styles.emptyDesc}>Try a different search term</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {Object.entries(groupedApplications).map(([category, chains]) => (
                  <ApplicationSection key={category} category={category} chains={chains} />
                ))}
                {filteredApplications.length === 0 && (
                  <View style={styles.emptyState}>
                    <Search size={40} color={Colors.textMuted} />
                    <Text style={styles.emptyTitle}>No applications found</Text>
                    <Text style={styles.emptyDesc}>Try a different search term</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
  },
  searchSection: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchWrap: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    padding: 0,
  },
  resultCount: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  tabRow: {
    paddingBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tabTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  contentWrapper: {
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingLeft: 2,
  },
  legendText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  specGroup: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 4,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  groupAccent: {
    width: 4,
    height: 22,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  groupTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupCount: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600' as const,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  specCardList: {
    gap: 10,
    marginTop: 6,
  },
  specCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    padding: 16,
  },
  specCardTablet: {
    padding: 20,
  },
  specCardHeader: {},
  specCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  specChainName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800' as const,
    letterSpacing: 0.3,
  },
  sealBadge: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sealBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  specCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specCategory: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  specMaxCC: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  specCardQuickStats: {
    flexDirection: 'row',
    gap: 8,
  },
  quickStat: {
    flex: 1,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  quickStatLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  quickStatValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  specCardDetails: {
    overflow: 'hidden',
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  detailGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  detailValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  masterLinkHeader: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    marginTop: 14,
    marginBottom: 8,
  },
  masterLinkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  masterLinkBadge: {
    flex: 1,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  masterLinkIncluded: {
    backgroundColor: 'rgba(46,204,113,0.1)',
  },
  masterLinkOption: {
    backgroundColor: 'rgba(212,168,67,0.1)',
  },
  masterLinkType: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  masterLinkValue: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  appSection: {
    marginBottom: 20,
  },
  appCategoryTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 10,
    paddingLeft: 2,
  },
  appChainList: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  appChainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  appChainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  appChainName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  appCCBadge: {
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  appCCText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  buyButton: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buyButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  buyButtonSmall: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buyButtonSmallText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  emptyDesc: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
