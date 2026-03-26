import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Shield,
  ShieldOff,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { ChainType, WearResult } from '@/constants/types';
import { chainPitchMap, getUniqueMakes, getModelsForMake, getYearsForMakeModel, getSpec } from '@/mocks/motorcycles';
import { useResponsive } from '@/hooks/useResponsive';

const SEALED_THRESHOLD = 1.0;
const NON_SEALED_THRESHOLD = 2.0;
const PITCHES_TO_MEASURE = 10;

type BikePickerField = 'make' | 'model' | 'year' | null;

export default function WearCalculatorScreen() {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const [chainType, setChainType] = useState<ChainType | null>(null);
  const [measuredLength, setMeasuredLength] = useState<string>('');
  const [chainSize, setChainSize] = useState<string>('520');
  const [wearResult, setWearResult] = useState<WearResult | null>(null);
  const [showChainSizePicker, setShowChainSizePicker] = useState(false);

  const [bikeMake, setBikeMake] = useState<string | null>(null);
  const [bikeModel, setBikeModel] = useState<string | null>(null);
  const [bikeYear, setBikeYear] = useState<number | null>(null);
  const [activeBikePicker, setActiveBikePicker] = useState<BikePickerField>(null);
  const [bikeLinked, setBikeLinked] = useState(false);

  const resultAnim = useRef(new Animated.Value(0)).current;

  const chainSizes = Object.keys(chainPitchMap);

  const makes = useMemo(() => getUniqueMakes(), []);
  const models = useMemo(
    () => (bikeMake ? getModelsForMake(bikeMake) : []),
    [bikeMake]
  );
  const years = useMemo(
    () => (bikeMake && bikeModel ? getYearsForMakeModel(bikeMake, bikeModel) : []),
    [bikeMake, bikeModel]
  );

  const linkedSpec = useMemo(() => {
    if (bikeYear && bikeMake && bikeModel) {
      return getSpec(bikeYear, bikeMake, bikeModel);
    }
    return null;
  }, [bikeYear, bikeMake, bikeModel]);

  const nominalLength = useMemo(() => {
    const pitch = chainPitchMap[chainSize] ?? 15.875;
    return pitch * PITCHES_TO_MEASURE;
  }, [chainSize]);

  const handleCalculate = useCallback(() => {
    const measured = parseFloat(measuredLength);
    if (isNaN(measured) || !chainType) {
      console.log('Invalid input for wear calculation');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const nominal = nominalLength;
    const wearPercentage = ((measured - nominal) / nominal) * 100;
    const threshold = chainType === 'sealed' ? SEALED_THRESHOLD : NON_SEALED_THRESHOLD;
    const needsReplacement = wearPercentage >= threshold;

    const result: WearResult = {
      measuredLength: measured,
      nominalLength: nominal,
      wearPercentage: Math.max(0, wearPercentage),
      needsReplacement,
      threshold,
      chainType,
    };

    setWearResult(result);
    resultAnim.setValue(0);
    Animated.spring(resultAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [measuredLength, chainType, nominalLength, resultAnim]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChainType(null);
    setMeasuredLength('');
    setWearResult(null);
    setBikeMake(null);
    setBikeModel(null);
    setBikeYear(null);
    setBikeLinked(false);
    setActiveBikePicker(null);
    resultAnim.setValue(0);
  }, [resultAnim]);

  const handleBikeMake = useCallback((make: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBikeMake(make);
    setBikeModel(null);
    setBikeYear(null);
    setBikeLinked(false);
    setActiveBikePicker('model');
  }, []);

  const handleBikeModel = useCallback((model: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBikeModel(model);
    setBikeYear(null);
    setBikeLinked(false);
    setActiveBikePicker('year');
  }, []);

  const handleBikeYear = useCallback((year: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBikeYear(year);
    setActiveBikePicker(null);
    const spec = bikeMake && bikeModel ? getSpec(year, bikeMake, bikeModel) : undefined;
    if (spec) {
      setChainSize(spec.chainSize);
      setBikeLinked(true);
    }
  }, [bikeMake, bikeModel]);

  const toggleBikePicker = useCallback((field: BikePickerField) => {
    setActiveBikePicker(prev => (prev === field ? null : field));
  }, []);

  const canCalculate = chainType !== null && measuredLength.length > 0 && !isNaN(parseFloat(measuredLength));

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
        keyboardShouldPersistTaps="handled"
      >
        <View style={[
          styles.contentWrapper,
          responsive.isTablet && { maxWidth: responsive.contentMaxWidth, width: '100%' as unknown as number },
        ]}>
          <View style={styles.headerRow}>
            <Text style={[styles.screenTitle, { fontSize: responsive.fontSize.screenTitle }]}>Wear Check</Text>
            {(chainType || wearResult) && (
              <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, responsive.isTablet && { width: 42, height: 42, borderRadius: 21 }]} testID="reset-wear">
                <RotateCcw size={responsive.isTablet ? 18 : 16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.screenSubtitle, { fontSize: responsive.isTablet ? 16 : 14 }]}>
            Measure 10 chain pitches to check for wear
          </Text>

          <View style={styles.bikeSection}>
            <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>LINK YOUR BIKE (OPTIONAL)</Text>
            <View style={styles.bikeSelectors}>
              <TouchableOpacity
                style={[styles.bikeSelectorBtn, activeBikePicker === 'make' && styles.bikeSelectorActive, responsive.isTablet && { padding: 14 }]}
                onPress={() => toggleBikePicker('make')}
              >
                <Text style={[styles.bikeSelectorText, bikeMake && styles.bikeSelectorFilled, responsive.isTablet && { fontSize: 16 }]}>
                  {bikeMake || 'Make'}
                </Text>
                {activeBikePicker === 'make' ? <ChevronUp size={14} color={Colors.textMuted} /> : <ChevronDown size={14} color={Colors.textMuted} />}
              </TouchableOpacity>

              {activeBikePicker === 'make' && (
                <View style={[styles.bikeOptionsList, responsive.isTablet && { maxHeight: 240 }]}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                    {makes.map(make => (
                      <TouchableOpacity key={make} style={[styles.bikeOptionItem, responsive.isTablet && { paddingVertical: 12, paddingHorizontal: 16 }]} onPress={() => handleBikeMake(make)}>
                        <Text style={[styles.bikeOptionText, bikeMake === make && styles.bikeOptionActive, responsive.isTablet && { fontSize: 16 }]}>{make}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {bikeMake && (
                <TouchableOpacity
                  style={[styles.bikeSelectorBtn, activeBikePicker === 'model' && styles.bikeSelectorActive, responsive.isTablet && { padding: 14 }]}
                  onPress={() => toggleBikePicker('model')}
                >
                  <Text style={[styles.bikeSelectorText, bikeModel && styles.bikeSelectorFilled, responsive.isTablet && { fontSize: 16 }]}>
                    {bikeModel || 'Model'}
                  </Text>
                  {activeBikePicker === 'model' ? <ChevronUp size={14} color={Colors.textMuted} /> : <ChevronDown size={14} color={Colors.textMuted} />}
                </TouchableOpacity>
              )}

              {activeBikePicker === 'model' && (
                <View style={[styles.bikeOptionsList, responsive.isTablet && { maxHeight: 240 }]}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                    {models.map(model => (
                      <TouchableOpacity key={model} style={[styles.bikeOptionItem, responsive.isTablet && { paddingVertical: 12, paddingHorizontal: 16 }]} onPress={() => handleBikeModel(model)}>
                        <Text style={[styles.bikeOptionText, bikeModel === model && styles.bikeOptionActive, responsive.isTablet && { fontSize: 16 }]}>{model}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {bikeModel && (
                <TouchableOpacity
                  style={[styles.bikeSelectorBtn, activeBikePicker === 'year' && styles.bikeSelectorActive, responsive.isTablet && { padding: 14 }]}
                  onPress={() => toggleBikePicker('year')}
                >
                  <Text style={[styles.bikeSelectorText, bikeYear && styles.bikeSelectorFilled, responsive.isTablet && { fontSize: 16 }]}>
                    {bikeYear ? String(bikeYear) : 'Year'}
                  </Text>
                  {activeBikePicker === 'year' ? <ChevronUp size={14} color={Colors.textMuted} /> : <ChevronDown size={14} color={Colors.textMuted} />}
                </TouchableOpacity>
              )}

              {activeBikePicker === 'year' && (
                <View style={[styles.bikeOptionsList, responsive.isTablet && { maxHeight: 240 }]}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                    {years.map(year => (
                      <TouchableOpacity key={year} style={[styles.bikeOptionItem, responsive.isTablet && { paddingVertical: 12, paddingHorizontal: 16 }]} onPress={() => handleBikeYear(year)}>
                        <Text style={[styles.bikeOptionText, bikeYear === year && styles.bikeOptionActive, responsive.isTablet && { fontSize: 16 }]}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            {bikeLinked && linkedSpec && (
              <View style={[styles.bikeLinkedBadge, responsive.isTablet && { padding: 12 }]}>
                <CheckCircle size={responsive.isTablet ? 16 : 14} color={Colors.success} />
                <Text style={[styles.bikeLinkedText, responsive.isTablet && { fontSize: 14 }]}>
                  Chain size set to {linkedSpec.chainSize} for {linkedSpec.year} {linkedSpec.make} {linkedSpec.model}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>CHAIN TYPE</Text>
            <View style={[styles.chainTypeRow, { gap: responsive.spacing.gridGap + 2 }]}>
              <TouchableOpacity
                style={[
                  styles.chainTypeCard,
                  chainType === 'sealed' && styles.chainTypeCardActive,
                  responsive.isTablet && { padding: 20 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setChainType('sealed');
                  setWearResult(null);
                }}
                testID="sealed-button"
              >
                <Shield
                  size={responsive.isTablet ? 28 : 24}
                  color={chainType === 'sealed' ? Colors.primary : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.chainTypeLabel,
                    chainType === 'sealed' && styles.chainTypeLabelActive,
                    responsive.isTablet && { fontSize: 17 },
                  ]}
                >
                  Sealed
                </Text>
                <Text style={[styles.chainTypeDesc, responsive.isTablet && { fontSize: 13 }]}>O-Ring / X-Ring</Text>
                <Text style={[styles.chainTypeThreshold, responsive.isTablet && { fontSize: 12 }]}>Replace at ≥ 1.0%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chainTypeCard,
                  chainType === 'non-sealed' && styles.chainTypeCardActive,
                  responsive.isTablet && { padding: 20 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setChainType('non-sealed');
                  setWearResult(null);
                }}
                testID="non-sealed-button"
              >
                <ShieldOff
                  size={responsive.isTablet ? 28 : 24}
                  color={chainType === 'non-sealed' ? Colors.primary : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.chainTypeLabel,
                    chainType === 'non-sealed' && styles.chainTypeLabelActive,
                    responsive.isTablet && { fontSize: 17 },
                  ]}
                >
                  Non-Sealed
                </Text>
                <Text style={[styles.chainTypeDesc, responsive.isTablet && { fontSize: 13 }]}>Standard Chain</Text>
                <Text style={[styles.chainTypeThreshold, responsive.isTablet && { fontSize: 12 }]}>Replace at ≥ 2.0%</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!bikeLinked && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>CHAIN SIZE</Text>
              <TouchableOpacity
                style={[styles.chainSizeSelector, responsive.isTablet && { padding: 16 }]}
                onPress={() => setShowChainSizePicker(!showChainSizePicker)}
              >
                <Text style={[styles.chainSizeValue, responsive.isTablet && { fontSize: 18 }]}>{chainSize}</Text>
                {showChainSizePicker ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
              </TouchableOpacity>
              {showChainSizePicker && (
                <View style={styles.chainSizeOptions}>
                  {chainSizes.map(size => (
                    <TouchableOpacity
                      key={size}
                      style={[styles.chainSizeOption, chainSize === size && styles.chainSizeOptionActive, responsive.isTablet && { paddingHorizontal: 20, paddingVertical: 12 }]}
                      onPress={() => {
                        setChainSize(size);
                        setShowChainSizePicker(false);
                        setWearResult(null);
                      }}
                    >
                      <Text style={[styles.chainSizeOptionText, chainSize === size && styles.chainSizeOptionTextActive, responsive.isTablet && { fontSize: 16 }]}>{size}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>MEASUREMENT</Text>
            <View style={[styles.measurementCard, { padding: responsive.isTablet ? 20 : 16 }]}>
              <View style={[styles.measurementInfoRow, responsive.isTablet && { padding: 12 }]}>
                <Info size={responsive.isTablet ? 16 : 14} color={Colors.info} />
                <Text style={[styles.measurementInfoText, responsive.isTablet && { fontSize: 14, lineHeight: 20 }]}>
                  Measure the distance across 10 pins (10 pitches) of your chain in millimeters. 
                  Nominal length for {chainSize} chain: {nominalLength.toFixed(2)} mm
                </Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.measurementInput, responsive.isTablet && { fontSize: 20, padding: 16 }]}
                  value={measuredLength}
                  onChangeText={(text) => {
                    setMeasuredLength(text);
                    setWearResult(null);
                  }}
                  placeholder={`e.g. ${(nominalLength * 1.01).toFixed(1)}`}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  testID="measurement-input"
                />
                <Text style={[styles.inputUnit, responsive.isTablet && { fontSize: 18 }]}>mm</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.calculateBtn, !canCalculate && styles.calculateBtnDisabled]}
            onPress={handleCalculate}
            disabled={!canCalculate}
            activeOpacity={0.85}
            testID="calculate-button"
          >
            <LinearGradient
              colors={canCalculate ? [Colors.primary, Colors.primaryDark] : [Colors.surfaceLight, Colors.surface]}
              style={[styles.calculateBtnGradient, responsive.isTablet && { paddingVertical: 18 }]}
            >
              <Text style={[styles.calculateBtnText, !canCalculate && styles.calculateBtnTextDisabled, responsive.isTablet && { fontSize: 18 }]}>
                Check Wear
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {wearResult && (
            <Animated.View
              style={[
                styles.resultSection,
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
              <View
                style={[
                  styles.resultCard,
                  wearResult.needsReplacement
                    ? styles.resultCardDanger
                    : styles.resultCardSuccess,
                  responsive.isTablet && { padding: 24 },
                ]}
              >
                <View style={styles.resultIconRow}>
                  {wearResult.needsReplacement ? (
                    <AlertTriangle size={responsive.isTablet ? 34 : 28} color={Colors.danger} />
                  ) : (
                    <CheckCircle size={responsive.isTablet ? 34 : 28} color={Colors.success} />
                  )}
                </View>
                <Text
                  style={[
                    styles.resultTitle,
                    wearResult.needsReplacement
                      ? styles.resultTitleDanger
                      : styles.resultTitleSuccess,
                    responsive.isTablet && { fontSize: 26 },
                  ]}
                >
                  {wearResult.needsReplacement ? 'Replace Your Chain' : 'Chain is OK'}
                </Text>
                <Text style={[styles.resultSubtitle, responsive.isTablet && { fontSize: 15 }]}>
                  {wearResult.needsReplacement
                    ? 'Your chain has exceeded the recommended wear limit'
                    : 'Your chain is within acceptable wear limits'}
                </Text>

                <View style={styles.resultStats}>
                  <View style={styles.resultStat}>
                    <Text style={[styles.resultStatLabel, responsive.isTablet && { fontSize: 13 }]}>Wear</Text>
                    <Text
                      style={[
                        styles.resultStatValue,
                        wearResult.needsReplacement
                          ? styles.resultStatDanger
                          : styles.resultStatSuccess,
                        responsive.isTablet && { fontSize: 20 },
                      ]}
                    >
                      {wearResult.wearPercentage.toFixed(2)}%
                    </Text>
                  </View>
                  <View style={styles.resultStatDivider} />
                  <View style={styles.resultStat}>
                    <Text style={[styles.resultStatLabel, responsive.isTablet && { fontSize: 13 }]}>Threshold</Text>
                    <Text style={[styles.resultStatValue, responsive.isTablet && { fontSize: 20 }]}>{wearResult.threshold.toFixed(1)}%</Text>
                  </View>
                  <View style={styles.resultStatDivider} />
                  <View style={styles.resultStat}>
                    <Text style={[styles.resultStatLabel, responsive.isTablet && { fontSize: 13 }]}>Stretch</Text>
                    <Text style={[styles.resultStatValue, responsive.isTablet && { fontSize: 20 }]}>
                      {(wearResult.measuredLength - wearResult.nominalLength).toFixed(2)} mm
                    </Text>
                  </View>
                </View>

                <View style={styles.wearBarContainer}>
                  <View style={[styles.wearBarBg, responsive.isTablet && { height: 10 }]}>
                    <View
                      style={[
                        styles.wearBarFill,
                        responsive.isTablet && { height: 10 },
                        {
                          width: `${Math.min(100, (wearResult.wearPercentage / (wearResult.threshold * 1.5)) * 100)}%` as unknown as number,
                          backgroundColor: wearResult.needsReplacement ? Colors.danger : Colors.success,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.wearBarThreshold,
                        { left: `${(wearResult.threshold / (wearResult.threshold * 1.5)) * 100}%` as unknown as number },
                        responsive.isTablet && { height: 14, top: -2 },
                      ]}
                    />
                  </View>
                  <View style={styles.wearBarLabels}>
                    <Text style={[styles.wearBarLabelLeft, responsive.isTablet && { fontSize: 12 }]}>0%</Text>
                    <Text style={[styles.wearBarLabelRight, responsive.isTablet && { fontSize: 12 }]}>{(wearResult.threshold * 1.5).toFixed(1)}%</Text>
                  </View>
                </View>
              </View>

              {wearResult.needsReplacement && linkedSpec && (
                <TouchableOpacity
                  style={[styles.replacementCard, { padding: responsive.spacing.cardPadding }]}
                  onPress={() => Linking.openURL(linkedSpec.recommendedChainUrl)}
                  activeOpacity={0.85}
                  testID="replacement-link"
                >
                  <View style={styles.replacementBadge}>
                    <Text style={[styles.replacementBadgeText, responsive.isTablet && { fontSize: 11 }]}>RECOMMENDED REPLACEMENT</Text>
                  </View>
                  <Text style={[styles.replacementChain, responsive.isTablet && { fontSize: 24 }]}>{linkedSpec.recommendedChain}</Text>
                  <Text style={[styles.replacementBikeText, responsive.isTablet && { fontSize: 14 }]}>
                    For your {linkedSpec.year} {linkedSpec.make} {linkedSpec.model}
                  </Text>
                  <View style={styles.replacementLinkRow}>
                    <Text style={[styles.replacementLinkText, responsive.isTablet && { fontSize: 15 }]}>Shop on didchain.com</Text>
                    <ExternalLink size={14} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              )}

              {wearResult.needsReplacement && !linkedSpec && (
                <TouchableOpacity
                  style={[styles.replacementCard, { padding: responsive.spacing.cardPadding }]}
                  onPress={() => Linking.openURL('https://www.didchain.com')}
                  activeOpacity={0.85}
                >
                  <View style={styles.replacementBadge}>
                    <Text style={[styles.replacementBadgeText, responsive.isTablet && { fontSize: 11 }]}>FIND YOUR REPLACEMENT</Text>
                  </View>
                  <Text style={[styles.replacementChain, responsive.isTablet && { fontSize: 24 }]}>Browse D.I.D. Chains</Text>
                  <Text style={[styles.replacementBikeText, responsive.isTablet && { fontSize: 14 }]}>
                    Link your bike above for a specific recommendation
                  </Text>
                  <View style={styles.replacementLinkRow}>
                    <Text style={[styles.replacementLinkText, responsive.isTablet && { fontSize: 15 }]}>Shop on didchain.com</Text>
                    <ExternalLink size={14} color={Colors.primary} />
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
  bikeSection: {
    marginBottom: 20,
  },
  bikeSelectors: {
    gap: 6,
  },
  bikeSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bikeSelectorActive: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bikeSelectorText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  bikeSelectorFilled: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  bikeOptionsList: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 180,
    paddingVertical: 2,
  },
  bikeOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bikeOptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  bikeOptionActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  bikeLinkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: 'rgba(46,204,113,0.08)',
    padding: 10,
    borderRadius: 8,
  },
  bikeLinkedText: {
    color: Colors.success,
    fontSize: 12,
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  chainTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chainTypeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  chainTypeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(227,25,55,0.06)',
  },
  chainTypeLabel: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  chainTypeLabelActive: {
    color: Colors.text,
  },
  chainTypeDesc: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  chainTypeThreshold: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  chainSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chainSizeValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  chainSizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chainSizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chainSizeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(227,25,55,0.08)',
  },
  chainSizeOptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  chainSizeOptionTextActive: {
    color: Colors.primary,
  },
  measurementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  measurementInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(52,152,219,0.08)',
    padding: 10,
    borderRadius: 8,
  },
  measurementInfoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  measurementInput: {
    flex: 1,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 10,
    padding: 14,
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700' as const,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputUnit: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  calculateBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  calculateBtnDisabled: {
    opacity: 0.5,
  },
  calculateBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  calculateBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  calculateBtnTextDisabled: {
    color: Colors.textMuted,
  },
  resultSection: {
    gap: 14,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  resultCardDanger: {
    backgroundColor: 'rgba(231,76,60,0.06)',
    borderColor: 'rgba(231,76,60,0.3)',
  },
  resultCardSuccess: {
    backgroundColor: 'rgba(46,204,113,0.06)',
    borderColor: 'rgba(46,204,113,0.3)',
  },
  resultIconRow: {
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  resultTitleDanger: {
    color: Colors.danger,
  },
  resultTitleSuccess: {
    color: Colors.success,
  },
  resultSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  resultStat: {
    flex: 1,
    alignItems: 'center',
  },
  resultStatLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  resultStatValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800' as const,
  },
  resultStatDanger: {
    color: Colors.danger,
  },
  resultStatSuccess: {
    color: Colors.success,
  },
  resultStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  wearBarContainer: {
    width: '100%',
  },
  wearBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  wearBarFill: {
    height: 8,
    borderRadius: 4,
  },
  wearBarThreshold: {
    position: 'absolute' as const,
    top: -2,
    width: 2,
    height: 12,
    backgroundColor: Colors.warning,
    borderRadius: 1,
  },
  wearBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  wearBarLabelLeft: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  wearBarLabelRight: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  replacementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  replacementBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: 'rgba(227,25,55,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  replacementBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  replacementChain: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  replacementBikeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 10,
  },
  replacementLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replacementLinkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
