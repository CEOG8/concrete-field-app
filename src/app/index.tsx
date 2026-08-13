import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OcrDemo from '../components/OcrDemo';

export default function LandingPage() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.logoText}>TEPUY QC</Text>
        
        {/* The bridge to your secure portal */}
        <Link href="/auth" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Enterprise Login</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.headline}>Digitize Your Concrete Testing</Text>
        <Text style={styles.subHeadline}>
          Eliminate manual data entry. Extract field data directly into your secure cloud database in seconds.
        </Text>
      </View>

      {/* The Interactive Demo */}
      <OcrDemo />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingBottom: 60,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    maxWidth: 700,
    alignSelf: 'center',
  },
  headline: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  subHeadline: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 28,
  },
});