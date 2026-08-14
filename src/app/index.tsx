import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import OcrDemo from '../components/OcrDemo';

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact'>('home');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Interactive Strength Forecaster state
  const [sevenDayPsi, setSevenDayPsi] = useState('3200');
  const [curingTemp, setCuringTemp] = useState('78');

  // Cinematic entrance transition animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [activeTab]);

  const handleContactSubmit = () => {
    if (!contactForm.email || !contactForm.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  // Calculate estimated 28-day strength using standard ACI concrete maturity relation (~65-70% at 7 days)
  const parsed7Day = parseFloat(sevenDayPsi) || 3000;
  const tempVal = parseFloat(curingTemp) || 72;
  // Higher temp slightly accelerates early gain, standard factor ~0.68
  const tempAdjustment = 1 + ((tempVal - 72) * 0.001); 
  const estimated28Day = Math.round((parsed7Day / 0.68) * tempAdjustment);
  const targetMet = estimated28Day >= 4000; // Assuming standard 4000 psi structural design mix

  return (
    <View style={styles.container}>
      {/* Sleek Enterprise Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.logoContainer} onPress={() => setActiveTab('home')} activeOpacity={0.8}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </TouchableOpacity>

        <View style={styles.navMenu}>
          <TouchableOpacity 
            style={[styles.navLink, activeTab === 'home' && styles.navLinkActive]} 
            onPress={() => setActiveTab('home')}
          >
            <Text style={[styles.navLinkText, activeTab === 'home' && styles.navLinkTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navLink, activeTab === 'about' && styles.navLinkActive]} 
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.navLinkText, activeTab === 'about' && styles.navLinkTextActive]}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navLink, activeTab === 'contact' && styles.navLinkActive]} 
            onPress={() => setActiveTab('contact')}
          >
            <Text style={[styles.navLinkText, activeTab === 'contact' && styles.navLinkTextActive]}>Contact</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/auth')}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={16} color="#ffffff" />
          <Text style={styles.loginButtonText}>Enterprise Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Animated Wrapper providing smooth transition */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* HOME TAB VIEW */}
          {activeTab === 'home' && (
            <>
              <View style={styles.heroSection}>
                <View style={styles.badgeRow}>
                  <Ionicons name="flash" size={14} color="#0284c7" />
                  <Text style={styles.badgeText}>Next-Gen Construction Quality Control</Text>
                </View>
                
                <Text style={styles.heroTitle}>Digitize Your Concrete Testing.</Text>
                <Text style={styles.heroSubtitle}>
                  Eliminate manual paperwork, eradicate transcription errors, and sync field data directly into your secure cloud database in seconds.
                </Text>

                <View style={styles.ctaRow}>
                  <TouchableOpacity style={styles.primaryCta} onPress={() => router.push('/new-ticket')} activeOpacity={0.9}>
                    <Text style={styles.primaryCtaText}>Launch Field Portal</Text>
                    <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.secondaryCta} onPress={() => setActiveTab('about')} activeOpacity={0.8}>
                    <Text style={styles.secondaryCtaText}>Our Vision</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Interactive OCR Demo Component */}
              <View style={styles.demoSection}>
                <Text style={styles.sectionHeading}>Interactive OCR Preview</Text>
                <OcrDemo />
              </View>

              {/* Interactive Cylinder Strength Forecaster Component */}
              <View style={styles.forecasterSection}>
                <View style={styles.forecasterCard}>
                  <View style={styles.forecasterHeader}>
                    <View style={styles.forecasterIconBox}>
                      <Ionicons name="analytics" size={24} color="#16a34a" />
                    </View>
                    <View>
                      <Text style={styles.forecasterTitle}>Live Cylinder Strength Forecaster</Text>
                      <Text style={styles.forecasterSub}>Project 28-day ultimate strength dynamically using ACI maturity modeling.</Text>
                    </View>
                  </View>

                  <View style={styles.forecasterBody}>
                    <View style={styles.forecasterInputs}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>7-Day Break Result (psi)</Text>
                        <TextInput 
                          style={styles.forecasterInput}
                          keyboardType="numeric"
                          value={sevenDayPsi}
                          onChangeText={setSevenDayPsi}
                          placeholder="e.g. 3200"
                          placeholderTextColor="#94a3b8"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Avg Curing Temperature (°F)</Text>
                        <TextInput 
                          style={styles.forecasterInput}
                          keyboardType="numeric"
                          value={curingTemp}
                          onChangeText={setCuringTemp}
                          placeholder="e.g. 78"
                          placeholderTextColor="#94a3b8"
                        />
                      </View>
                    </View>

                    <View style={styles.forecasterResultBox}>
                      <Text style={styles.resultHeaderTitle}>Projected 28-Day Strength</Text>
                      <Text style={styles.resultPsiValue}>{estimated28Day.toLocaleString()} <Text style={styles.psiUnit}>psi</Text></Text>
                      
                      <View style={[styles.statusBadge, { backgroundColor: targetMet ? '#f0fdf4' : '#fef2f2', borderColor: targetMet ? '#bbf7d0' : '#fecaca' }]}>
                        <Ionicons name={targetMet ? "checkmark-circle" : "alert-circle"} size={16} color={targetMet ? "#16a34a" : "#dc2626"} />
                        <Text style={[styles.statusText, { color: targetMet ? '#15803d' : '#b91c1c' }]}>
                          {targetMet ? 'Exceeds 4,000 psi Structural Target' : 'Below 4,000 psi Target Threshold'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Features Grid */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: '#e0f2fe' }]}>
                    <Ionicons name="cloud-upload" size={22} color="#0284c7" />
                  </View>
                  <Text style={styles.featureTitle}>Real-Time Cloud Sync</Text>
                  <Text style={styles.featureDesc}>Built on robust Supabase architecture to ensure your field tickets are instantly accessible across teams.</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: '#f0fdf4' }]}>
                    <Ionicons name="analytics" size={22} color="#16a34a" />
                  </View>
                  <Text style={styles.featureTitle}>Strength Forecaster</Text>
                  <Text style={styles.featureDesc}>Project 7-day and 28-day concrete cylinder breaks dynamically based on live temperature and batch data.</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="shield-checkmark" size={22} color="#d97706" />
                  </View>
                  <Text style={styles.featureTitle}>Enterprise Secure</Text>
                  <Text style={styles.featureDesc}>Strict role-based authentication guarding sensitive project logs and geotechnical testing records.</Text>
                </View>
              </View>
            </>
          )}

          {/* ABOUT TAB VIEW */}
          {activeTab === 'about' && (
            <View style={styles.staticPageContainer}>
              <Text style={styles.pageTitle}>Engineered for the Field.</Text>
              <Text style={styles.pageBody}>
                TEPUY QC was built out of firsthand field experience in geotechnical and construction materials testing. Managing concrete slump tests, air content, cylinder casting, and truck tickets on crumpled paper pads introduces massive operational friction and human error.
              </Text>
              <Text style={styles.pageBody}>
                Our mission is to bridge the gap between heavy civil engineering and modern cloud software. By leveraging edge OCR parsing and instant database synchronization, TEPUY QC saves engineering firms hours of administrative rework every single week.
              </Text>
              
              <View style={styles.statBoxRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>100%</Text>
                  <Text style={styles.statLabel}>Digital Workflow</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Transcription Errors</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>Cloud Availability</Text>
                </View>
              </View>
            </View>
          )}

          {/* CONTACT TAB VIEW */}
          {activeTab === 'contact' && (
            <View style={styles.staticPageContainer}>
              <Text style={styles.pageTitle}>Let's Build Together.</Text>
              <Text style={styles.pageSubtitleContact}>
                Have questions about enterprise deployment, custom OCR integrations, or partnership opportunities? Drop us a line below.
              </Text>

              <View style={styles.contactFormCard}>
                {submitted ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
                    <Text style={styles.successTitle}>Message Received!</Text>
                    <Text style={styles.successDesc}>Thank you for reaching out. An engineering representative will contact you shortly.</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>Your Name</Text>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="e.g., Sarah Jenkins"
                      placeholderTextColor="#94a3b8"
                      value={contactForm.name}
                      onChangeText={(val) => setContactForm({ ...contactForm, name: val })}
                    />

                    <Text style={styles.inputLabel}>Work Email *</Text>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="e.g., s.jenkins@engineering.com"
                      placeholderTextColor="#94a3b8"
                      value={contactForm.email}
                      onChangeText={(val) => setContactForm({ ...contactForm, email: val })}
                    />

                    <Text style={styles.inputLabel}>Message *</Text>
                    <TextInput 
                      style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
                      placeholder="Tell us about your project or inquiry..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      value={contactForm.message}
                      onChangeText={(val) => setContactForm({ ...contactForm, message: val })}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleContactSubmit} activeOpacity={0.9}>
                      <Text style={styles.submitButtonText}>Send Message</Text>
                      <Ionicons name="send" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}

        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} TEPUY QC. Enterprise Quality Assurance Systems.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: { cursor: 'pointer' as any },
  logoImage: { width: 170, height: 44 },
  navMenu: { flexDirection: 'row', gap: 8, backgroundColor: '#f1f5f9', padding: 4, borderRadius: 10 },
  navLink: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
  navLinkActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  navLinkText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  navLinkTextActive: { color: '#0f172a' },
  loginButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  loginButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  
  scrollContent: { paddingBottom: 60 },
  
  heroSection: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  badgeText: { color: '#0369a1', fontSize: 13, fontWeight: '600' },
  heroTitle: { fontSize: 52, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 20, maxWidth: 900, letterSpacing: -1 },
  heroSubtitle: { fontSize: 18, color: '#475569', textAlign: 'center', maxWidth: 680, lineHeight: 28, marginBottom: 36 },
  
  ctaRow: { flexDirection: 'row', gap: 16 },
  primaryCta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, shadowColor: '#0284c7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10 },
  primaryCtaText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryCta: { justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
  secondaryCtaText: { color: '#334155', fontSize: 16, fontWeight: '600' },

  demoSection: { alignItems: 'center', paddingHorizontal: 24, marginBottom: 50 },
  sectionHeading: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 24, letterSpacing: -0.5 },

  forecasterSection: { alignItems: 'center', paddingHorizontal: 24, marginBottom: 60 },
  forecasterCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 700, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
  forecasterHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16 },
  forecasterIconBox: { backgroundColor: '#f0fdf4', padding: 10, borderRadius: 10 },
  forecasterTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  forecasterSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  forecasterBody: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 24, alignItems: 'center' },
  forecasterInputs: { flex: 1, width: '100%', gap: 16 },
  inputGroup: { width: '100%' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  forecasterInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#0f172a', fontWeight: 'bold' },
  forecasterResultBox: { flex: 1, width: '100%', backgroundColor: '#f8fafc', borderRadius: 12, padding: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  resultHeaderTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 4 },
  resultPsiValue: { fontSize: 36, fontWeight: '900', color: '#0284c7', marginBottom: 12 },
  psiUnit: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  featuresContainer: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', justifyContent: 'center', gap: 24, paddingHorizontal: 32, marginBottom: 60 },
  featureCard: { flex: 1, maxWidth: 320, backgroundColor: '#ffffff', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  featureIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 22 },

  staticPageContainer: { width: '100%', maxWidth: 750, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40 },
  pageTitle: { fontSize: 42, fontWeight: '900', color: '#0f172a', marginBottom: 20, textAlign: 'center', letterSpacing: -1 },
  pageSubtitleContact: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 36, lineHeight: 24 },
  pageBody: { fontSize: 16, color: '#475569', lineHeight: 28, marginBottom: 22 },
  
  statBoxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, gap: 16 },
  statBox: { flex: 1, backgroundColor: '#ffffff', padding: 24, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  statNumber: { fontSize: 32, fontWeight: '900', color: '#0284c7', marginBottom: 6 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  contactFormCard: { backgroundColor: '#ffffff', padding: 36, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 16 },
  textInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#0f172a' },
  submitButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, borderRadius: 8, marginTop: 28 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  successBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  successDesc: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },

  footer: { paddingVertical: 36, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', marginTop: 40 },
  footerText: { fontSize: 13, color: '#94a3b8' }
});