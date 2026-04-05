import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(10,10,10,0.98)',
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: Colors.amber,
          tabBarInactiveTintColor: Colors.muted,
          tabBarLabelStyle: {
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="builder"
          options={{
            title: 'Builder',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="construct-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="diagnostic"
          options={{
            title: 'Diagnose',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="pulse-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: 'Gallery',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="garage"
          options={{
            title: 'Garage',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
