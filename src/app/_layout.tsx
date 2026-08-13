import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (initializing) return;

    // Web-safe route matching (Bypasses Expo segments bug)
    const inAuthGroup = pathname === '/auth';
    const isLandingPage = pathname === '/' || pathname === '/index' || pathname === '';

    if (!session && !inAuthGroup && !isLandingPage) {
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      router.replace('/history');
    }
  }, [session, initializing, pathname]);

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Only show the enterprise navigation bar if the user is securely logged in
  const showSecureNavBar = session && pathname !== '/auth' && pathname !== '/' && pathname !== '/index' && pathname !== '';

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {showSecureNavBar && (
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.iconWrapper}>
               <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>TEPUY QC</Text>
          </View>

          <View style={styles.navLinks}>
            <TouchableOpacity
              style={[styles.navItem, pathname === '/new-ticket' && styles.navItemActive]}
              onPress={() => router.push('/new-ticket')}
            >
              <Ionicons name="add-circle" size={16} color={pathname === '/new-ticket' ? '#0f172a' : '#64748b'} />
              {Platform.OS === 'web' && <Text style={[styles.navText, pathname === '/new-ticket' && styles.navTextActive]}>New Ticket</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem, pathname === '/history' && styles.navItemActive]}
              onPress={() => router.push('/history')}
            >
              <Ionicons name="analytics" size={16} color={pathname === '/history' ? '#0f172a' : '#64748b'} />
              {Platform.OS === 'web' && <Text style={[styles.navText, pathname === '/history' && styles.navTextActive]}>History</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={async () => {
            await supabase.auth.signOut();
            router.replace('/auth');
          }}>
            <Ionicons name="log-out-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="new-ticket" />
          <Stack.Screen name="history" />
          <Stack.Screen name="auth" /> 
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 12, paddingTop: Platform.OS === 'web' ? 12 : 48, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrapper: { backgroundColor: '#2563eb', padding: 4, borderRadius: 8 },
  headerTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  navLinks: { flexDirection: 'row', gap: 8, backgroundColor: '#f1f5f9', padding: 4, borderRadius: 12 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  navItemActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  navText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  navTextActive: { color: '#0f172a' },
  logoutBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' }
});