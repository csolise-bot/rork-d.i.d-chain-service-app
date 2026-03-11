import { Tabs } from 'expo-router';
import { Home, Search, Ruler, Calculator } from 'lucide-react-native';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 600;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 13 : 11,
          fontWeight: '600' as const,
        },
        tabBarIconStyle: isTablet ? { marginBottom: -2 } : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={isTablet ? size + 4 : size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chain-finder"
        options={{
          title: 'Chain Finder',
          tabBarIcon: ({ color, size }) => <Search size={isTablet ? size + 4 : size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chain-length"
        options={{
          title: 'Chain Length',
          tabBarIcon: ({ color, size }) => <Calculator size={isTablet ? size + 4 : size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wear-calculator"
        options={{
          title: 'Wear Check',
          tabBarIcon: ({ color, size }) => <Ruler size={isTablet ? size + 4 : size} color={color} />,
        }}
      />
    </Tabs>
  );
}
