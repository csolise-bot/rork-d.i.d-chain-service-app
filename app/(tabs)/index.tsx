import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Ruler, ExternalLink, Link2, Zap, Shield, ListOrdered } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useResponsive } from '@/hooks/useResponsive';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const responsive = useResponsive();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const openWebsite = () => {
    Linking.openURL('https://www.didchain.com');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
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
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/did-logo.png')}
                style={[styles.logoImage, responsive.isTablet && { width: 130, height: 52 }]}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.heroTitle, { fontSize: responsive.fontSize.heroTitle, lineHeight: responsive.fontSize.heroTitle * 1.15 }]}>
              Precision Chain{'\n'}Solutions
            </Text>
            <Text style={[styles.heroSubtitle, { fontSize: responsive.fontSize.body }]}>
              Find the perfect chain setup for your motorcycle. Adjust gearing, check wear, and get D.I.D. product recommendations.
            </Text>
          </Animated.View>

          <View style={[styles.toolsSection, { marginBottom: responsive.spacing.sectionGap }]}>
            <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>TOOLS</Text>

            <Animated.View style={{ opacity: cardAnims[0], transform: [{ translateY: cardAnims[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <TouchableOpacity
                style={styles.toolCard}
                activeOpacity={0.85}
                onPress={() => router.push('/chain-finder' as never)}
                testID="chain-finder-button"
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.toolCardGradient, { padding: responsive.spacing.cardPadding }]}
                >
                  <View style={styles.toolCardContent}>
                    <View style={[styles.toolIconWrap, responsive.isTablet && { width: 52, height: 52, borderRadius: 14 }]}>
                      <Search size={responsive.isTablet ? 28 : 24} color={Colors.white} />
                    </View>
                    <View style={styles.toolTextWrap}>
                      <Text style={[styles.toolCardTitle, responsive.isTablet && { fontSize: 19 }]}>Chain Finder</Text>
                      <Text style={[styles.toolCardDesc, { fontSize: responsive.fontSize.small }]}>
                        Select your bike to get exact chain, sprocket specs, and gearing ratios. Adjust gearing with auto chain length recalculation.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.toolCardArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ opacity: cardAnims[1], transform: [{ translateY: cardAnims[1].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <TouchableOpacity
                style={styles.toolCard}
                activeOpacity={0.85}
                onPress={() => router.push('/wear-calculator' as never)}
                testID="wear-calculator-button"
              >
                <View style={[styles.toolCardDark, { padding: responsive.spacing.cardPadding }]}>
                  <View style={styles.toolCardContent}>
                    <View style={[styles.toolIconWrap, styles.toolIconWrapAlt, responsive.isTablet && { width: 52, height: 52, borderRadius: 14 }]}>
                      <Ruler size={responsive.isTablet ? 28 : 24} color={Colors.primary} />
                    </View>
                    <View style={styles.toolTextWrap}>
                      <Text style={[styles.toolCardTitle, responsive.isTablet && { fontSize: 19 }]}>Wear Calculator</Text>
                      <Text style={[styles.toolCardDescDark, { fontSize: responsive.fontSize.small }]}>
                        Measure your chain's 10-pitch length and find out if it needs replacing. Get D.I.D. replacement recommendations.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.toolCardArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={[styles.featuresSection, { marginBottom: responsive.spacing.sectionGap - 4 }]}>
            <Text style={[styles.sectionLabel, { fontSize: responsive.fontSize.label }]}>WHY D.I.D.</Text>
            <View style={[styles.featuresGrid, { gap: responsive.spacing.gridGap }]}>
              <View style={[styles.featureCard, { padding: responsive.isTablet ? 18 : 14 }]}>
                <View style={[styles.featureIconBg, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}>
                  <Link2 size={responsive.isTablet ? 22 : 18} color={Colors.primary} />
                </View>
                <Text style={[styles.featureTitle, { fontSize: responsive.fontSize.small }]}>Superior Balance</Text>
                <Text style={[styles.featureDesc, { fontSize: responsive.isTablet ? 12 : 10, lineHeight: responsive.isTablet ? 17 : 14 }]}>
                  Engineered for premium strength to weight ratio
                </Text>
              </View>
              <View style={[styles.featureCard, { padding: responsive.isTablet ? 18 : 14 }]}>
                <View style={[styles.featureIconBg, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}>
                  <Zap size={responsive.isTablet ? 22 : 18} color={Colors.chainGold} />
                </View>
                <Text style={[styles.featureTitle, { fontSize: responsive.fontSize.small }]}>Race Proven</Text>
                <Text style={[styles.featureDesc, { fontSize: responsive.isTablet ? 12 : 10, lineHeight: responsive.isTablet ? 17 : 14 }]}>
                  Top choice by world champion race teams globally
                </Text>
              </View>
              <View style={[styles.featureCard, { padding: responsive.isTablet ? 18 : 14 }]}>
                <View style={[styles.featureIconBg, responsive.isTablet && { width: 44, height: 44, borderRadius: 12 }]}>
                  <Shield size={responsive.isTablet ? 22 : 18} color={Colors.success} />
                </View>
                <Text style={[styles.featureTitle, { fontSize: responsive.fontSize.small }]}>Sealed Tech</Text>
                <Text style={[styles.featureDesc, { fontSize: responsive.isTablet ? 12 : 10, lineHeight: responsive.isTablet ? 17 : 14 }]}>
                  Patented X-Ring seal design for premium ride quality and chain life
                </Text>
              </View>
            </View>
          </View>

          <Animated.View style={{ opacity: cardAnims[2], transform: [{ translateY: cardAnims[2].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <TouchableOpacity
              style={[styles.websiteCard, { padding: responsive.spacing.cardPadding }]}
              activeOpacity={0.85}
              onPress={openWebsite}
              testID="website-button"
            >
              <View style={styles.websiteCardInner}>
                <ExternalLink size={18} color={Colors.primary} />
                <Text style={[styles.websiteCardText, { fontSize: responsive.fontSize.body }]}>Visit didchain.com</Text>
              </View>
              <Text style={[styles.websiteCardSub, { fontSize: responsive.fontSize.small }]}>Browse full product catalog and dealers</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: cardAnims[3], transform: [{ translateY: cardAnims[3].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <TouchableOpacity
              style={[styles.specsCard, { padding: responsive.spacing.cardPadding }]}
              activeOpacity={0.85}
              onPress={() => router.push('/product-specs' as never)}
              testID="product-specs-button"
            >
              <View style={styles.websiteCardInner}>
                <ListOrdered size={18} color={Colors.primary} />
                <Text style={[styles.websiteCardText, { fontSize: responsive.fontSize.body }]}>Product Lineup Specs</Text>
              </View>
              <Text style={[styles.websiteCardSub, { fontSize: responsive.fontSize.small }]}>View full D.I.D chain spec chart and applications</Text>
            </TouchableOpacity>
          </Animated.View>

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
  header: {
    marginTop: 16,
    marginBottom: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  logoImage: {
    width: 100,
    height: 40,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 42,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  toolsSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  toolCard: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },
  toolCardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolCardDark: {
    backgroundColor: Colors.surface,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },
  toolCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  toolIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIconWrapAlt: {
    backgroundColor: 'rgba(227,25,55,0.15)',
  },
  toolTextWrap: {
    flex: 1,
  },
  toolCardTitle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  toolCardDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 18,
  },
  toolCardDescDark: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  toolCardArrow: {
    marginLeft: 8,
  },
  arrowText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '300' as const,
  },
  featuresSection: {
    marginBottom: 28,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  websiteCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  websiteCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  websiteCardText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  websiteCardSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginLeft: 28,
  },
  specsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 12,
  },
});
