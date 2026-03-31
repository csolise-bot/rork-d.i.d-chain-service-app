import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Minus,
  Plus,
  Settings2,
  Info,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { MotorcycleSpec, GearingResult } from '@/constants/types';
import {
  getUniqueMakes,
  getModelsForMake,
  getYearsForMakeModel,
  getSpec,
  calculateGearingRatio,
  estimateChainLength,
} from '@/mocks/motorcycles';
import { useResponsive } from '@/hooks/useResponsive';

type PickerField = 'make' | 'model' | 'year' | null;

export default function ChainFinderScreen() {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeSpec, setActiveSpec] = useState<MotorcycleSpec | null>(null);
  const [activePicker, setActivePicker] = useState<PickerField>(null);

  const [adjustedFront, setAdjustedFront] = useState<number>(0);
  const [adjustedRear, setAdjustedRear] = useState<number>(0);
  const [showGearingTool, setShowGearingTool] = useState(false);

  const resultAnim = useRef(new Animated.Value(0)).current;

  const makes = useMemo(() => getUniqueMakes(), []);
  const models = useMemo(
    () => (selectedMake ? getModelsForMake(selectedMake) : []),
    [selectedMake]
  );
  const years = useMemo(
    () =>
      selectedMake && selectedModel
        ? getYearsForMakeModel(selectedMake, selectedModel)
        : [],
    [selectedMake, selectedModel]
  );

  const handleMakeSelect = useCallback((make: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMake(make);
    setSelectedModel(null);
    setSelectedYear(null);
    setActiveSpec(null);
    setActivePicker('model');
    setShowGearingTool(false);
    resultAnim.setValue(0);
  }, [resultAnim]);

  const handleModelSelect = useCallback((model: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedModel(model);
    setSelectedYear(null);
    setActiveSpec(null);
    setActivePicker('year');
    setShowGearingTool(false);
    resultAnim.setValue(0);
  }, [resultAnim]);

  const handleYearSelect = useCallback((year: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedYear(year);
    setActivePicker(null);
    const spec = selectedMake && selectedModel ? getSpec(year, selectedMake, selectedModel) : undefined;
    if (spec) {
      setActiveSpec(spec);
      setAdjustedFront(spec.frontSprocket);
      setAdjustedRear(spec.rearSprocket);
      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [selectedMake, selectedModel, resultAnim]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setActiveSpec(null);
    setActivePicker(null);
    setShowGearingTool(false);
    resultAnim.setValue(0);
  }, [resultAnim]);

  const gearingResult: GearingResult | null = useMemo(() => {
    if (!activeSpec) return null;
    const originalRatio = calculateGearingRatio(activeSpec.frontSprocket, activeSpec.rearSprocket);
    const newRatio = calculateGearingRatio(adjustedFront, adjustedRear);
    const newLength = estimateChainLength(
      activeSpec.frontSprocket,
      activeSpec.rearSprocket,
      activeSpec.chainLength,
      adjustedFront,
      adjustedRear
    );
    const ratioChange = ((newRatio - originalRatio) / originalRatio) * 100;
    return {
      frontSprocket: adjustedFront,
      rearSprocket: adjustedRear,
      chainSize: activeSpec.chainSize,
      chainLength: newLength,
      gearingRatio: newRatio,
      originalGearingRatio: originalRatio,
      originalChainLength: activeSpec.chainLength,
      ratioChange,
    };
  }, [activeSpec, adjustedFront, adjustedRear]);

  const adjustSprocket = useCallback((type: 'front' | 'rear', delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'front') {
      setAdjustedFront(prev => Math.max(10, Math.min(20, prev + delta)));
    } else {
      setAdjustedRear(prev => Math.max(30, Math.min(60, prev + delta)));
    }
  }, []);

  const isGearingModified = activeSpec
    ? adjustedFront !== activeSpec.frontSprocket || adjustedRear !== activeSpec.rearSprocket
    : false;

  const resetGearing = useCallback(() => {
    if (activeSpec) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAdjustedFront(activeSpec.frontSprocket);
      setAdjustedRear(activeSpec.rearSprocket);
    }
  }, [activeSpec]);

  const togglePicker = useCallback((field: PickerField) => {
    setActivePicker(prev => (prev === field ? null : field));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
            paddingHorizontal: responsive.horizontalPadding,
            alignItems: responsive.isTablet ? 'center' as const : 'stretch' as const,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.contentWrapper,
          responsive.isTablet && { maxWidth: responsive.contentMaxWidth, width: '100%' as unknown as number },
        ]}>
          <View style={styles.headerRow}>
            <Text style={[styles.screenTitle, { fontSize: responsive.fontSize.screenTitle }]}>Chain Finder</Text>
            {activeSpec && (
              <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, responsive.isTablet && { width: 42, height: 42, borderRadius: 21 }]} testID="reset-button">
                <RotateCcw size={responsive.isTablet ? 18 : 16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.screenSubtitle, { fontSize: responsive.isTablet ? 16 : 14 }]}>Select your motorcycle to find exact specs</Text>

          <View style={styles.selectorsContainer}>
            <TouchableOpacity
              style={[styles.selectorBtn, activePicker === 'make' && styles.selectorBtnActive, responsive.isTablet && { padding: 18 }]}
              onPress={() => togglePicker('make')}
              testID="make-selector"
            >
              <Text style={[styles.selectorLabel, selectedMake && styles.selectorLabelFilled, responsive.isTablet && { fontSize: 16 }]}>
                {selectedMake || 'Select Make'}
              </Text>
              {activePicker === 'make' ? (
                <ChevronUp size={18} color={Colors.textSecondary} />
              ) : (
                <ChevronDown size={18} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>

            {activePicker === 'make' && (
              <View style={[styles.optionsList, responsive.isTablet && { maxHeight: 280 }]}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                  {makes.map(make => (
                    <TouchableOpacity
                      key={make}
                      style={[styles.optionItem, selectedMake === make && styles.optionItemActive, responsive.isTablet && { paddingVertical: 14, paddingHorizontal: 18 }]}
                      onPress={() => handleMakeSelect(make)}
                    >
                      <Text
                        style={[styles.optionText, selectedMake === make && styles.optionTextActive, responsive.isTablet && { fontSize: 16 }]}
                      >
                        {make}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedMake && (
              <TouchableOpacity
                style={[styles.selectorBtn, activePicker === 'model' && styles.selectorBtnActive, responsive.isTablet && { padding: 18 }]}
                onPress={() => togglePicker('model')}
                testID="model-selector"
              >
                <Text style={[styles.selectorLabel, selectedModel && styles.selectorLabelFilled, responsive.isTablet && { fontSize: 16 }]}>
                  {selectedModel || 'Select Model'}
                </Text>
                {activePicker === 'model' ? (
                  <ChevronUp size={18} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={18} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            )}

            {activePicker === 'model' && (
              <View style={[styles.optionsList, responsive.isTablet && { maxHeight: 280 }]}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                  {models.map(model => (
                    <TouchableOpacity
                      key={model}
                      style={[styles.optionItem, selectedModel === model && styles.optionItemActive, responsive.isTablet && { paddingVertical: 14, paddingHorizontal: 18 }]}
                      onPress={() => handleModelSelect(model)}
                    >
                      <Text
                        style={[styles.optionText, selectedModel === model && styles.optionTextActive, responsive.isTablet && { fontSize: 16 }]}
                      >
                        {model}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedModel && (
              <TouchableOpacity
                style={[styles.selectorBtn, activePicker === 'year' && styles.selectorBtnActive, responsive.isTablet && { padding: 18 }]}
                onPress={() => togglePicker('year')}
                testID="year-selector"
              >
                <Text style={[styles.selectorLabel, selectedYear != null && styles.selectorLabelFilled, responsive.isTablet && { fontSize: 16 }]}>
                  {selectedYear ? String(selectedYear) : 'Select Year'}
                </Text>
                {activePicker === 'year' ? (
                  <ChevronUp size={18} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={18} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            )}

            {activePicker === 'year' && (
              <View style={[styles.optionsList, responsive.isTablet && { maxHeight: 280 }]}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                  {years.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[styles.optionItem, selectedYear === year && styles.optionItemActive, responsive.isTablet && { paddingVertical: 14, paddingHorizontal: 18 }]}
                      onPress={() => handleYearSelect(year)}
                    >
                      <Text
                        style={[styles.optionText, selectedYear === year && styles.optionTextActive, responsive.isTablet && { fontSize: 16 }]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {activeSpec && gearingResult && (
            <Animated.View
              style={[
                styles.resultsSection,
                {
                  opacity: resultAnim,
                  transform: [
                    {
                      translateY: resultAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.bikeHeader}>
                <Text style={[styles.bikeTitle, responsive.isTablet && { fontSize: 24 }]}>
                  {activeSpec.year} {activeSpec.make} {activeSpec.model}
                </Text>
              </View>

              <View style={[styles.specsGrid, { gap: responsive.spacing.gridGap }]}>
                <View style={[styles.specCard, responsive.isTablet && { padding: 18 }]}>
                  <Text style={[styles.specValue, responsive.isTablet && { fontSize: 26 }]}>{gearingResult.frontSprocket}T</Text>
                  <Text style={[styles.specLabel, { fontSize: responsive.fontSize.label }]}>Front Sprocket</Text>
                </View>
                <View style={[styles.specCard, responsive.isTablet && { padding: 18 }]}>
                  <Text style={[styles.specValue, responsive.isTablet && { fontSize: 26 }]}>{gearingResult.rearSprocket}T</Text>
                  <Text style={[styles.specLabel, { fontSize: responsive.fontSize.label }]}>Rear Sprocket</Text>
                </View>
                <View style={[styles.specCard, responsive.isTablet && { padding: 18 }]}>
                  <Text style={[styles.specValue, responsive.isTablet && { fontSize: 26 }]}>{gearingResult.chainSize}</Text>
                  <Text style={[styles.specLabel, { fontSize: responsive.fontSize.label }]}>Chain Size</Text>
                </View>
                <View style={[styles.specCard, responsive.isTablet && { padding: 18 }]}>
                  <Text style={[styles.specValue, responsive.isTablet && { fontSize: 26 }]}>{gearingResult.chainLength}L</Text>
                  <Text style={[styles.specLabel, { fontSize: responsive.fontSize.label }]}>Chain Length</Text>
                </View>
              </View>

              <View style={styles.ratioCard}>
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={[styles.ratioCardInner, responsive.isTablet && { padding: 28 }]}
                >
                  <Text style={[styles.ratioLabel, responsive.isTablet && { fontSize: 14 }]}>Gearing Ratio</Text>
                  <Text style={[styles.ratioValue, responsive.isTablet && { fontSize: 44 }]}>{gearingResult.gearingRatio.toFixed(3)}</Text>
                  {isGearingModified && (
                    <View style={styles.ratioChangeRow}>
                      <Text
                        style={[
                          styles.ratioChangeText,
                          gearingResult.ratioChange > 0
                            ? styles.ratioHigher
                            : styles.ratioLower,
                          responsive.isTablet && { fontSize: 16 },
                        ]}
                      >
                        {gearingResult.ratioChange > 0 ? '↑' : '↓'}{' '}
                        {Math.abs(gearingResult.ratioChange).toFixed(1)}% vs stock
                      </Text>
                      <Text style={[styles.ratioChangeHint, responsive.isTablet && { fontSize: 13 }]}>
                        {gearingResult.ratioChange > 0 ? 'More acceleration' : 'More top speed'}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </View>

              <TouchableOpacity
                style={[styles.gearingToggle, responsive.isTablet && { paddingVertical: 16 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowGearingTool(!showGearingTool);
                }}
                testID="gearing-toggle"
              >
                <Settings2 size={18} color="#fff" />
                <Text style={[styles.gearingToggleText, responsive.isTablet && { fontSize: 16 }]}>
                  {showGearingTool ? 'Hide Gearing Adjuster' : 'Adjust Gearing'}
                </Text>
              </TouchableOpacity>

              {showGearingTool && (
                <View style={[styles.gearingTool, { padding: responsive.spacing.cardPadding }]}>
                  <View style={styles.gearingInfoRow}>
                    <Info size={14} color={Colors.info} />
                    <Text style={[styles.gearingInfoText, responsive.isTablet && { fontSize: 14 }]}>
                      Adjust sprocket teeth to see how gearing and chain length change
                    </Text>
                  </View>

                  <View style={styles.adjustRow}>
                    <Text style={[styles.adjustLabel, responsive.isTablet && { fontSize: 16 }]}>Front Sprocket</Text>
                    <View style={styles.adjustControls}>
                      <TouchableOpacity
                        style={[styles.adjustBtn, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}
                        onPress={() => adjustSprocket('front', -1)}
                        testID="front-minus"
                      >
                        <Minus size={16} color={Colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.adjustValue, responsive.isTablet && { fontSize: 22 }]}>{adjustedFront}T</Text>
                      <TouchableOpacity
                        style={[styles.adjustBtn, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}
                        onPress={() => adjustSprocket('front', 1)}
                        testID="front-plus"
                      >
                        <Plus size={16} color={Colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.adjustRow}>
                    <Text style={[styles.adjustLabel, responsive.isTablet && { fontSize: 16 }]}>Rear Sprocket</Text>
                    <View style={styles.adjustControls}>
                      <TouchableOpacity
                        style={[styles.adjustBtn, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}
                        onPress={() => adjustSprocket('rear', -1)}
                        testID="rear-minus"
                      >
                        <Minus size={16} color={Colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.adjustValue, responsive.isTablet && { fontSize: 22 }]}>{adjustedRear}T</Text>
                      <TouchableOpacity
                        style={[styles.adjustBtn, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}
                        onPress={() => adjustSprocket('rear', 1)}
                        testID="rear-plus"
                      >
                        <Plus size={16} color={Colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isGearingModified && (
                    <View style={styles.chainLengthChange}>
                      <Text style={[styles.chainLengthChangeLabel, responsive.isTablet && { fontSize: 15 }]}>
                        Estimated Chain Length:
                      </Text>
                      <Text style={[styles.chainLengthChangeValue, responsive.isTablet && { fontSize: 17 }]}>
                        {gearingResult.chainLength}L
                        {gearingResult.chainLength !== gearingResult.originalChainLength && (
                          <Text style={styles.chainLengthDiff}>
                            {' '}({gearingResult.chainLength > gearingResult.originalChainLength ? '+' : ''}
                            {gearingResult.chainLength - gearingResult.originalChainLength} links)
                          </Text>
                        )}
                      </Text>
                    </View>
                  )}

                  {isGearingModified && (
                    <TouchableOpacity style={styles.resetGearingBtn} onPress={resetGearing}>
                      <RotateCcw size={14} color={Colors.primary} />
                      <Text style={[styles.resetGearingText, responsive.isTablet && { fontSize: 15 }]}>Reset to Stock</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.recommendedCard, { padding: responsive.spacing.cardPadding }]}
                onPress={() => Linking.openURL(activeSpec.recommendedChainUrl)}
                activeOpacity={0.85}
                testID="recommended-chain"
              >
                <View style={styles.recommendedBadge}>
                  <Text style={[styles.recommendedBadgeText, responsive.isTablet && { fontSize: 11 }]}>TOP RECOMMENDATION</Text>
                </View>
                <Text style={[styles.recommendedChain, responsive.isTablet && { fontSize: 24 }]}>{activeSpec.recommendedChain}</Text>
                <View style={styles.recommendedLinkRow}>
                  <Text style={[styles.recommendedLinkText, responsive.isTablet && { fontSize: 15 }]}>View on didchain.com</Text>
                  <ExternalLink size={14} color={Colors.primary} />
                </View>
              </TouchableOpacity>

              {activeSpec.secondaryChain && activeSpec.secondaryChainUrl && (
                <TouchableOpacity
                  style={[styles.secondaryCard, { padding: responsive.spacing.cardPadding }]}
                  onPress={() => Linking.openURL(activeSpec.secondaryChainUrl!)}
                  activeOpacity={0.85}
                  testID="secondary-chain"
                >
                  <View style={styles.secondaryBadge}>
                    <Text style={[styles.secondaryBadgeText, responsive.isTablet && { fontSize: 11 }]}>ALSO RECOMMENDED</Text>
                  </View>
                  <Text style={[styles.secondaryChain, responsive.isTablet && { fontSize: 22 }]}>{activeSpec.secondaryChain}</Text>
                  <View style={styles.recommendedLinkRow}>
                    <Text style={[styles.secondaryLinkText, responsive.isTablet && { fontSize: 15 }]}>View on didchain.com</Text>
                    <ExternalLink size={14} color={Colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800' as const,
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  screenSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  selectorsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorBtnActive: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectorLabel: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  selectorLabelFilled: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  optionsList: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 4,
    maxHeight: 220,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionItemActive: {
    backgroundColor: 'rgba(227,25,55,0.1)',
  },
  optionText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  resultsSection: {
    marginTop: 8,
  },
  bikeHeader: {
    marginBottom: 16,
  },
  bikeTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  specCard: {
    flex: 1,
    minWidth: '45%' as unknown as number,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  specValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800' as const,
    marginBottom: 2,
  },
  specLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  ratioCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratioCardInner: {
    padding: 20,
    alignItems: 'center',
  },
  ratioLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  ratioValue: {
    color: Colors.chainGold,
    fontSize: 36,
    fontWeight: '900' as const,
  },
  ratioChangeRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  ratioChangeText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  ratioHigher: {
    color: Colors.warning,
  },
  ratioLower: {
    color: Colors.info,
  },
  ratioChangeHint: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  gearingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(227,25,55,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(227,25,55,1)',
    marginBottom: 14,
  },
  gearingToggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  gearingTool: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 16,
  },
  gearingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(52,152,219,0.08)',
    padding: 10,
    borderRadius: 8,
  },
  gearingInfoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adjustLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  adjustControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  adjustValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800' as const,
    minWidth: 40,
    textAlign: 'center' as const,
  },
  chainLengthChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chainLengthChangeLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  chainLengthChangeValue: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  chainLengthDiff: {
    color: Colors.warning,
    fontWeight: '600' as const,
    fontSize: 13,
  },
  resetGearingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  resetGearingText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  recommendedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recommendedBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: 'rgba(227,25,55,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  recommendedBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  recommendedChain: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  recommendedLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendedLinkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  secondaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  secondaryBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: 'rgba(150,150,150,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  secondaryBadgeText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  secondaryChain: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  secondaryLinkText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
