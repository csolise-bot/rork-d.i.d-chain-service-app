import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Link,
  Gauge,
  Calculator,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useResponsive } from '@/hooks/useResponsive';

const CHAIN_SIZES = ['420', '428', '520', '525', '530'] as const;

type ChainSize = typeof CHAIN_SIZES[number];

const CHAIN_PITCH: Record<ChainSize, number> = {
  '420': 12.7,
  '428': 12.7,
  '520': 15.875,
  '525': 15.875,
  '530': 15.875,
};

interface CalculationResult {
  originalRatio: number;
  newRatio: number;
  ratioChange: number;
  accelerationChange: number;
  newChainLength: number;
  chainLengthDiff: number;
}

function estimateNewChainLength(
  origFront: number,
  origRear: number,
  origLength: number,
  newFront: number,
  newRear: number,
): number {
  const sprocketDiff = ((newFront - origFront) + (newRear - origRear)) / 2;
  const estimated = origLength + Math.round(sprocketDiff);
  return estimated % 2 === 0 ? estimated : estimated + 1;
}

export default function ChainLengthScreen() {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const resultAnim = useRef(new Animated.Value(0)).current;

  const [chainSize, setChainSize] = useState<ChainSize | null>(null);
  const [showChainPicker, setShowChainPicker] = useState(false);

  const [origFront, setOrigFront] = useState('');
  const [origRear, setOrigRear] = useState('');
  const [origLength, setOrigLength] = useState('');

  const [newFront, setNewFront] = useState('');
  const [newRear, setNewRear] = useState('');

  const [hasCalculated, setHasCalculated] = useState(false);

  const canCalculate = useMemo(() => {
    const of = parseInt(origFront);
    const or2 = parseInt(origRear);
    const ol = parseInt(origLength);
    const nf = parseInt(newFront);
    const nr = parseInt(newRear);
    return (
      chainSize !== null &&
      !isNaN(of) && of >= 8 && of <= 25 &&
      !isNaN(or2) && or2 >= 25 && or2 <= 70 &&
      !isNaN(ol) && ol >= 80 && ol <= 200 &&
      !isNaN(nf) && nf >= 8 && nf <= 25 &&
      !isNaN(nr) && nr >= 25 && nr <= 70
    );
  }, [chainSize, origFront, origRear, origLength, newFront, newRear]);

  const result: CalculationResult | null = useMemo(() => {
    if (!hasCalculated || !canCalculate || !chainSize) return null;

    const of = parseInt(origFront);
    const or2 = parseInt(origRear);
    const ol = parseInt(origLength);
    const nf = parseInt(newFront);
    const nr = parseInt(newRear);

    const originalRatio = Math.round((or2 / of) * 1000) / 1000;
    const newRatio = Math.round((nr / nf) * 1000) / 1000;
    const ratioChange = ((newRatio - originalRatio) / originalRatio) * 100;
    const accelerationChange = ratioChange;
    const newChainLength = estimateNewChainLength(of, or2, ol, nf, nr);
    const chainLengthDiff = newChainLength - ol;

    return {
      originalRatio,
      newRatio,
      ratioChange,
      accelerationChange,
      newChainLength,
      chainLengthDiff,
    };
  }, [hasCalculated, canCalculate, chainSize, origFront, origRear, origLength, newFront, newRear]);

  const handleCalculate = useCallback(() => {
    if (!canCalculate) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHasCalculated(true);
    resultAnim.setValue(0);
    Animated.spring(resultAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [canCalculate, resultAnim]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChainSize(null);
    setOrigFront('');
    setOrigRear('');
    setOrigLength('');
    setNewFront('');
    setNewRear('');
    setHasCalculated(false);
    setShowChainPicker(false);
    resultAnim.setValue(0);
  }, [resultAnim]);

  const handleInputChange = useCallback(() => {
    if (hasCalculated) {
      setHasCalculated(false);
      resultAnim.setValue(0);
    }
  }, [hasCalculated, resultAnim]);

  const setOrigFrontWrapped = useCallback((v: string) => {
    setOrigFront(v);
    handleInputChange();
  }, [handleInputChange]);

  const setOrigRearWrapped = useCallback((v: string) => {
    setOrigRear(v);
    handleInputChange();
  }, [handleInputChange]);

  const setOrigLengthWrapped = useCallback((v: string) => {
    setOrigLength(v);
    handleInputChange();
  }, [handleInputChange]);

  const setNewFrontWrapped = useCallback((v: string) => {
    setNewFront(v);
    handleInputChange();
  }, [handleInputChange]);

  const setNewRearWrapped = useCallback((v: string) => {
    setNewRear(v);
    handleInputChange();
  }, [handleInputChange]);

  const isModified = useMemo(() => {
    if (!result) return false;
    return origFront !== newFront || origRear !== newRear;
  }, [result, origFront, origRear, newFront, newRear]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
              <Text style={[styles.screenTitle, { fontSize: responsive.fontSize.screenTitle }]}>Chain Length</Text>
              {(origFront !== '' || origRear !== '' || origLength !== '' || chainSize) && (
                <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, responsive.isTablet && { width: 42, height: 42, borderRadius: 21 }]} testID="reset-length-button">
                  <RotateCcw size={responsive.isTablet ? 18 : 16} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.screenSubtitle, { fontSize: responsive.isTablet ? 16 : 14 }]}>
              Calculate chain length & gearing changes
            </Text>

            <View style={[styles.sectionCard, { padding: responsive.spacing.cardPadding }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={[styles.sectionTitle, { fontSize: responsive.fontSize.sectionTitle }]}>Current Setup</Text>
              </View>

              <TouchableOpacity
                style={[styles.chainSizeBtn, showChainPicker && styles.chainSizeBtnActive, responsive.isTablet && { padding: 16 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowChainPicker(!showChainPicker);
                }}
                testID="chain-size-picker"
              >
                <Text style={[styles.chainSizeLabel, chainSize && styles.chainSizeLabelFilled, responsive.isTablet && { fontSize: 16 }]}>
                  {chainSize ? `${chainSize} Chain` : 'Select Chain Size'}
                </Text>
                {showChainPicker ? (
                  <ChevronUp size={18} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={18} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>

              {showChainPicker && (
                <View style={styles.chainSizeOptions}>
                  {CHAIN_SIZES.map(size => (
                    <TouchableOpacity
                      key={size}
                      style={[styles.chainSizeOption, chainSize === size && styles.chainSizeOptionActive, responsive.isTablet && { paddingVertical: 14, paddingHorizontal: 18 }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setChainSize(size);
                        setShowChainPicker(false);
                        handleInputChange();
                      }}
                    >
                      <Text style={[styles.chainSizeOptionText, chainSize === size && styles.chainSizeOptionTextActive, responsive.isTablet && { fontSize: 16 }]}>
                        {size}
                      </Text>
                      <Text style={[styles.chainSizePitch, responsive.isTablet && { fontSize: 13 }]}>
                        {CHAIN_PITCH[size]}mm pitch
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: responsive.fontSize.small }]}>Front Sprocket</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.textInput, responsive.isTablet && { fontSize: 20, paddingVertical: 14 }]}
                      value={origFront}
                      onChangeText={setOrigFrontWrapped}
                      keyboardType="number-pad"
                      placeholder="13"
                      placeholderTextColor={Colors.textMuted}
                      maxLength={2}
                      testID="orig-front-input"
                    />
                    <Text style={[styles.inputSuffix, responsive.isTablet && { fontSize: 16 }]}>T</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: responsive.fontSize.small }]}>Rear Sprocket</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.textInput, responsive.isTablet && { fontSize: 20, paddingVertical: 14 }]}
                      value={origRear}
                      onChangeText={setOrigRearWrapped}
                      keyboardType="number-pad"
                      placeholder="48"
                      placeholderTextColor={Colors.textMuted}
                      maxLength={2}
                      testID="orig-rear-input"
                    />
                    <Text style={[styles.inputSuffix, responsive.isTablet && { fontSize: 16 }]}>T</Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupFull}>
                  <Text style={[styles.inputLabel, { fontSize: responsive.fontSize.small }]}>Chain Length (links)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.textInput, responsive.isTablet && { fontSize: 20, paddingVertical: 14 }]}
                      value={origLength}
                      onChangeText={setOrigLengthWrapped}
                      keyboardType="number-pad"
                      placeholder="114"
                      placeholderTextColor={Colors.textMuted}
                      maxLength={3}
                      testID="orig-length-input"
                    />
                    <Text style={[styles.inputSuffix, responsive.isTablet && { fontSize: 16 }]}>L</Text>
                  </View>
                </View>
              </View>

              {origFront !== '' && origRear !== '' && (
                <View style={[styles.currentRatioRow, responsive.isTablet && { paddingVertical: 12, paddingHorizontal: 14 }]}>
                  <Gauge size={responsive.isTablet ? 16 : 14} color={Colors.chainGold} />
                  <Text style={[styles.currentRatioLabel, responsive.isTablet && { fontSize: 15 }]}>Current Ratio:</Text>
                  <Text style={[styles.currentRatioValue, responsive.isTablet && { fontSize: 17 }]}>
                    {!isNaN(parseInt(origRear)) && !isNaN(parseInt(origFront)) && parseInt(origFront) > 0
                      ? (parseInt(origRear) / parseInt(origFront)).toFixed(3)
                      : '—'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.arrowContainer}>
              <View style={styles.arrowLine} />
              <View style={[styles.arrowCircle, responsive.isTablet && { width: 42, height: 42, borderRadius: 21 }]}>
                <ArrowRight size={18} color={Colors.primary} style={{ transform: [{ rotate: '90deg' }] }} />
              </View>
              <View style={styles.arrowLine} />
            </View>

            <View style={[styles.sectionCard, { padding: responsive.spacing.cardPadding }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, styles.sectionDotNew]} />
                <Text style={[styles.sectionTitle, { fontSize: responsive.fontSize.sectionTitle }]}>New Setup</Text>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: responsive.fontSize.small }]}>Front Sprocket</Text>
                  <View style={[styles.inputWrapper, styles.inputWrapperNew]}>
                    <TextInput
                      style={[styles.textInput, responsive.isTablet && { fontSize: 20, paddingVertical: 14 }]}
                      value={newFront}
                      onChangeText={setNewFrontWrapped}
                      keyboardType="number-pad"
                      placeholder={origFront || '13'}
                      placeholderTextColor={Colors.textMuted}
                      maxLength={2}
                      testID="new-front-input"
                    />
                    <Text style={[styles.inputSuffix, responsive.isTablet && { fontSize: 16 }]}>T</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: responsive.fontSize.small }]}>Rear Sprocket</Text>
                  <View style={[styles.inputWrapper, styles.inputWrapperNew]}>
                    <TextInput
                      style={[styles.textInput, responsive.isTablet && { fontSize: 20, paddingVertical: 14 }]}
                      value={newRear}
                      onChangeText={setNewRearWrapped}
                      keyboardType="number-pad"
                      placeholder={origRear || '48'}
                      placeholderTextColor={Colors.textMuted}
                      maxLength={2}
                      testID="new-rear-input"
                    />
                    <Text style={[styles.inputSuffix, responsive.isTablet && { fontSize: 16 }]}>T</Text>
                  </View>
                </View>
              </View>

              {newFront !== '' && newRear !== '' && (
                <View style={[styles.currentRatioRow, responsive.isTablet && { paddingVertical: 12, paddingHorizontal: 14 }]}>
                  <Gauge size={responsive.isTablet ? 16 : 14} color={Colors.info} />
                  <Text style={[styles.currentRatioLabel, responsive.isTablet && { fontSize: 15 }]}>New Ratio:</Text>
                  <Text style={[styles.currentRatioValue, { color: Colors.info }, responsive.isTablet && { fontSize: 17 }]}>
                    {!isNaN(parseInt(newRear)) && !isNaN(parseInt(newFront)) && parseInt(newFront) > 0
                      ? (parseInt(newRear) / parseInt(newFront)).toFixed(3)
                      : '—'}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.calculateBtn, !canCalculate && styles.calculateBtnDisabled, responsive.isTablet && { paddingVertical: 18 }]}
              onPress={handleCalculate}
              disabled={!canCalculate}
              activeOpacity={0.8}
              testID="calculate-button"
            >
              <Calculator size={responsive.isTablet ? 20 : 18} color={canCalculate ? Colors.white : Colors.textMuted} />
              <Text style={[styles.calculateBtnText, !canCalculate && styles.calculateBtnTextDisabled, responsive.isTablet && { fontSize: 18 }]}>
                Calculate
              </Text>
            </TouchableOpacity>

            {result && (
              <Animated.View
                style={[
                  styles.resultsContainer,
                  {
                    opacity: resultAnim,
                    transform: [{
                      translateY: resultAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    }],
                  },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Text style={[styles.resultHeaderText, responsive.isTablet && { fontSize: 24 }]}>Results</Text>
                </View>

                <View style={styles.resultMainCard}>
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={[styles.resultMainInner, responsive.isTablet && { padding: 30 }]}
                  >
                    <Text style={[styles.resultMainLabel, responsive.isTablet && { fontSize: 14 }]}>New Chain Length</Text>
                    <View style={styles.resultMainRow}>
                      <Link size={responsive.isTablet ? 28 : 24} color={Colors.chainGold} />
                      <Text style={[styles.resultMainValue, responsive.isTablet && { fontSize: 50 }]}>{result.newChainLength}L</Text>
                    </View>
                    {result.chainLengthDiff !== 0 && (
                      <View style={styles.resultDiffBadge}>
                        <Text style={[
                          styles.resultDiffText,
                          result.chainLengthDiff > 0 ? styles.diffPositive : styles.diffNegative,
                          responsive.isTablet && { fontSize: 15 },
                        ]}>
                          {result.chainLengthDiff > 0 ? '+' : ''}{result.chainLengthDiff} links vs current
                        </Text>
                      </View>
                    )}
                    {result.chainLengthDiff === 0 && (
                      <Text style={[styles.resultSameText, responsive.isTablet && { fontSize: 15 }]}>Same as current setup</Text>
                    )}
                  </LinearGradient>
                </View>

                <View style={[styles.resultStatsRow, { gap: responsive.spacing.gridGap }]}>
                  <View style={[styles.resultStatCard, responsive.isTablet && { padding: 18 }]}>
                    <Text style={[styles.resultStatLabel, { fontSize: responsive.fontSize.label }]}>Original Ratio</Text>
                    <Text style={[styles.resultStatValue, responsive.isTablet && { fontSize: 28 }]}>{result.originalRatio.toFixed(3)}</Text>
                    <Text style={[styles.resultStatSub, responsive.isTablet && { fontSize: 13 }]}>
                      {parseInt(origFront)}T / {parseInt(origRear)}T
                    </Text>
                  </View>
                  <View style={[styles.resultStatCard, responsive.isTablet && { padding: 18 }]}>
                    <Text style={[styles.resultStatLabel, { fontSize: responsive.fontSize.label }]}>New Ratio</Text>
                    <Text style={[styles.resultStatValue, { color: Colors.info }, responsive.isTablet && { fontSize: 28 }]}>
                      {result.newRatio.toFixed(3)}
                    </Text>
                    <Text style={[styles.resultStatSub, responsive.isTablet && { fontSize: 13 }]}>
                      {parseInt(newFront)}T / {parseInt(newRear)}T
                    </Text>
                  </View>
                </View>

                {isModified && (
                  <View style={[styles.accelCard, { padding: responsive.spacing.cardPadding }]}>
                    <View style={styles.accelRow}>
                      {result.accelerationChange > 0 ? (
                        <TrendingUp size={responsive.isTablet ? 24 : 20} color={Colors.warning} />
                      ) : result.accelerationChange < 0 ? (
                        <TrendingDown size={responsive.isTablet ? 24 : 20} color={Colors.info} />
                      ) : null}
                      <View style={styles.accelTextCol}>
                        <Text style={[styles.accelTitle, responsive.isTablet && { fontSize: 18 }]}>
                          {result.accelerationChange > 0
                            ? 'More Acceleration'
                            : result.accelerationChange < 0
                            ? 'More Top Speed'
                            : 'No Change'}
                        </Text>
                        <Text style={[
                          styles.accelPercent,
                          result.accelerationChange > 0 ? styles.accelUp : styles.accelDown,
                          responsive.isTablet && { fontSize: 16 },
                        ]}>
                          {result.accelerationChange > 0 ? '↑' : result.accelerationChange < 0 ? '↓' : ''}
                          {' '}{Math.abs(result.accelerationChange).toFixed(1)}% change in acceleration
                        </Text>
                      </View>
                    </View>
                    <View style={styles.accelBarBg}>
                      <View
                        style={[
                          styles.accelBarFill,
                          {
                            width: `${Math.min(Math.abs(result.accelerationChange) * 5, 100)}%`,
                            backgroundColor: result.accelerationChange > 0 ? Colors.warning : Colors.info,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.accelHint, responsive.isTablet && { fontSize: 14 }]}>
                      {result.accelerationChange > 0
                        ? 'Higher ratio = quicker off the line, lower top speed'
                        : result.accelerationChange < 0
                        ? 'Lower ratio = higher top speed, slower acceleration'
                        : 'Gearing unchanged from stock'}
                    </Text>
                  </View>
                )}

                <View style={[styles.summaryCard, { padding: responsive.spacing.cardPadding }]}>
                  <Text style={[styles.summaryTitle, responsive.isTablet && { fontSize: 17 }]}>Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, responsive.isTablet && { fontSize: 15 }]}>Chain Size</Text>
                    <Text style={[styles.summaryValue, responsive.isTablet && { fontSize: 16 }]}>{chainSize}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, responsive.isTablet && { fontSize: 15 }]}>Original</Text>
                    <Text style={[styles.summaryValue, responsive.isTablet && { fontSize: 16 }]}>
                      {origFront}/{origRear} — {origLength}L
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, responsive.isTablet && { fontSize: 15 }]}>New</Text>
                    <Text style={[styles.summaryValue, { color: Colors.primary }, responsive.isTablet && { fontSize: 16 }]}>
                      {newFront}/{newRear} — {result.newChainLength}L
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, responsive.isTablet && { fontSize: 15 }]}>Ratio Change</Text>
                    <Text style={[
                      styles.summaryValue,
                      result.ratioChange > 0 ? { color: Colors.warning } : result.ratioChange < 0 ? { color: Colors.info } : {},
                      responsive.isTablet && { fontSize: 16 },
                    ]}>
                      {result.ratioChange > 0 ? '+' : ''}{result.ratioChange.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
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
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  sectionDotNew: {
    backgroundColor: Colors.primary,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  chainSizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  chainSizeBtnActive: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  chainSizeLabel: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  chainSizeLabelFilled: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  chainSizeOptions: {
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  chainSizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chainSizeOptionActive: {
    backgroundColor: 'rgba(227,25,55,0.1)',
  },
  chainSizeOptionText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  chainSizeOptionTextActive: {
    color: Colors.primary,
  },
  chainSizePitch: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupFull: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingRight: 12,
  },
  inputWrapperNew: {
    borderColor: 'rgba(227,25,55,0.3)',
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700' as const,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  inputSuffix: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  currentRatioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,168,67,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  currentRatioLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  currentRatioValue: {
    color: Colors.chainGold,
    fontSize: 15,
    fontWeight: '800' as const,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 0,
  },
  arrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  calculateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
  },
  calculateBtnDisabled: {
    backgroundColor: Colors.surfaceHighlight,
  },
  calculateBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  calculateBtnTextDisabled: {
    color: Colors.textMuted,
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultHeader: {
    marginBottom: 14,
  },
  resultHeaderText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  resultMainCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  resultMainInner: {
    padding: 24,
    alignItems: 'center',
  },
  resultMainLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  resultMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultMainValue: {
    color: Colors.chainGold,
    fontSize: 42,
    fontWeight: '900' as const,
  },
  resultDiffBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(227,25,55,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resultDiffText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  diffPositive: {
    color: Colors.warning,
  },
  diffNegative: {
    color: Colors.info,
  },
  resultSameText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
  resultStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  resultStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  resultStatLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  resultStatValue: {
    color: Colors.chainGold,
    fontSize: 24,
    fontWeight: '800' as const,
  },
  resultStatSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  accelCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  accelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  accelTextCol: {
    flex: 1,
  },
  accelTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  accelPercent: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  accelUp: {
    color: Colors.warning,
  },
  accelDown: {
    color: Colors.info,
  },
  accelBarBg: {
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  accelBarFill: {
    height: 6,
    borderRadius: 3,
  },
  accelHint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
