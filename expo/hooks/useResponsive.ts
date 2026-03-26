import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

interface ResponsiveValues {
  isTablet: boolean;
  isLargeTablet: boolean;
  contentMaxWidth: number;
  horizontalPadding: number;
  fontSize: {
    heroTitle: number;
    screenTitle: number;
    sectionTitle: number;
    body: number;
    small: number;
    label: number;
  };
  spacing: {
    cardPadding: number;
    sectionGap: number;
    gridGap: number;
  };
  gridColumns: number;
  specGridColumns: number;
}

export function useResponsive(): ResponsiveValues {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);

  return useMemo(() => {
    const isTablet = shortSide >= 600;
    const isLargeTablet = shortSide >= 800;

    const contentMaxWidth = isLargeTablet ? 720 : isTablet ? 640 : 9999;
    const horizontalPadding = isTablet ? 32 : 20;

    const fontSize = {
      heroTitle: isTablet ? 44 : 36,
      screenTitle: isTablet ? 34 : 28,
      sectionTitle: isTablet ? 18 : 16,
      body: isTablet ? 17 : 15,
      small: isTablet ? 14 : 12,
      label: isTablet ? 13 : 11,
    };

    const spacing = {
      cardPadding: isTablet ? 24 : 18,
      sectionGap: isTablet ? 40 : 32,
      gridGap: isTablet ? 14 : 10,
    };

    const gridColumns = isTablet ? 3 : 3;
    const specGridColumns = isTablet ? 4 : 2;

    return {
      isTablet,
      isLargeTablet,
      contentMaxWidth,
      horizontalPadding,
      fontSize,
      spacing,
      gridColumns,
      specGridColumns,
    };
  }, [shortSide]);
}
