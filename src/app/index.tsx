import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import OcrDemo from '../components/OcrDemo';

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Breakpoint for mobile screens

  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [sevenDayPsi, setSevenDayPsi] = useState('3200');
  const [curingTemp, setCuringTemp] = useState('78');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);
    setIsMobileMenuOpen(false); // Close mobile menu when switching tabs

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, [activeTab]);

  const handleContactSubmit = () => {
    if (!contactForm.email || !contactForm.message) return;
    setSubmitted(true);
    setTimeout(() => { setContactForm({ name: '', email: '', message: '' }); setSubmitted(false); }, 3000);
  };

  const parsed7Day = parseFloat(sevenDayPsi) || 3000;
  const tempVal = parseFloat(curingTemp) || 72;
  const tempAdjustment = 1 + ((tempVal - 72) * 0.001); 
  const estimated28Day = Math.round((parsed7Day / 0.68) * tempAdjustment);
  const targetMet = estimated28Day >= 4000;

  return (
    <View style={styles.container}>
      {/* Responsive Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.logoContainer} onPress={() => setActiveTab('home')} activeOpacity={0.8}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </TouchableOpacity>

        {isMobile ? (
          <TouchableOpacity onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={styles.mobileMenuBtn}>
            <Ionicons name={isMobileMenuOpen ? "close" : "menu"} size={28} color="#0f172a" />
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.navMenu}>
              {['home', 'about', 'contact'].map((tab) => (
                <TouchableOpacity key={tab} style={[styles.navLink, activeTab === tab && styles.navLinkActive]} onPress={() => setActiveTab(tab as any)}>
                  <Text style={[styles.navLinkText, activeTab === tab && styles.navLinkTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/auth')} activeOpacity={0.85}>
              <Ionicons name="log-in-outline" size={16} color="#ffffff" />
              <Text style={styles.loginButtonText}>Enterprise Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Mobile Dropdown Menu */}
      {isMobile && isMobileMenuOpen && (
        <View style={styles.mobileDropdown}>
          {['home', 'about', 'contact'].map((tab) => (
            <TouchableOpacity key={tab} style={styles.mobileDropdownItem} onPress={() => setActiveTab(tab as any)}>
              <Text style={[styles.mobileDropdownText, activeTab === tab && styles.mobileDropdownTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.loginButton, { marginTop: 12, justifyContent: 'center' }]} onPress={() => router.push('/auth')}>
            <Ionicons name="log-in-outline" size={16} color="#ffffff" />
            <Text style={styles.loginButtonText}>Enterprise Login</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* HOME TAB VIEW */}
          {activeTab === 'home' && (
            <>
              <View style={[styles.heroSection, isMobile && { paddingTop: 40 }]}>
                <View style={styles.badgeRow}>
                  <Ionicons name="flash" size={14} color="#0284c7" />
                  <Text style={styles.badgeText}>Next-Gen Construction Quality Control</Text>
                </View>
                
                <Text style={[styles.heroTitle, isMobile && { fontSize: 36, lineHeight: 42 }]}>Digitize Your Concrete Testing.</Text>
                <Text style={[styles.heroSubtitle, isMobile && { fontSize: 16, lineHeight: 24 }]}>
                  Eliminate manual paperwork, eradicate transcription errors, and sync field data directly into your secure cloud database in seconds.
                </Text>

                <View style={[styles.ctaRow, isMobile && { flexDirection: 'column', width: '100%', paddingHorizontal: 20 }]}>
                  <TouchableOpacity style={styles.primaryCta} onPress={() => router.push('/new-ticket')} activeOpacity={0.9}>
                    <Text style={styles.primaryCtaText}>Launch Field Portal</Text>
                    <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryCta} onPress={() => setActiveTab('about')} activeOpacity={0.8}>
                    <Text style={styles.secondaryCtaText}>Our Vision</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.demoSection}>
                <Text style={[styles.sectionHeading, isMobile && { fontSize: 20 }]}>Interactive OCR Preview</Text>
                <OcrDemo />
              </View>

              <View style={styles.forecasterSection}>
                <View style={[styles.forecasterCard, isMobile && { padding: 20 }]}>
                  <View style={styles.forecasterHeader}>
                    <View style={styles.forecasterIconBox}><Ionicons name="analytics" size={24} color="#16a34a" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.forecasterTitle, isMobile && { fontSize: 16 }]}>Live Cylinder Strength Forecaster</Text>
                      <Text style={styles.forecasterSub}>Project 28-day ultimate strength dynamically.</Text>
                    </View>
                  </View>

                  <View style={[styles.forecasterBody, isMobile && { flexDirection: 'column' }]}>
                    <View style={styles.forecasterInputs}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>7-Day Break Result (psi)</Text>
                        <TextInput style={styles.forecasterInput} keyboardType="numeric" value={sevenDayPsi} onChangeText={setSevenDayPsi} placeholder="e.g. 3200" />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Avg Curing Temperature (°F)</Text>
                        <TextInput style={styles.forecasterInput} keyboardType="numeric" value={curingTemp} onChangeText={setCuringTemp} placeholder="e.g. 78" />
                      </View>
                    </View>

                    <View style={styles.forecasterResultBox}>
                      <Text style={styles.resultHeaderTitle}>Projected 28-Day Strength</Text>
                      <Text style={styles.resultPsiValue}>{estimated28Day.toLocaleString()} <Text style={styles.psiUnit}>psi</Text></Text>
                      <View style={[styles.statusBadge, { backgroundColor: targetMet ? '#f0fdf4' : '#fef2f2', borderColor: targetMet ? '#bbf7d0' : '#fecaca' }]}>
                        <Ionicons name={targetMet ? "checkmark-circle" : "alert-circle"} size={16} color={targetMet ? "#16a34a" : "#dc2626"} />
                        <Text style={[styles.statusText, { color: targetMet ? '#15803d' : '#b91c1c' }, isMobile && { fontSize: 10 }]}>
                          {targetMet ? 'Exceeds 4,000 psi Target' : 'Below 4,000 psi Target'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.featuresContainer, isMobile && { flexDirection: 'column', paddingHorizontal: 20 }]}>
                {[
                  { icon: 'cloud-upload', color: '#0284c7', bg: '#e0f2fe', title: 'Real-Time Cloud Sync', desc: 'Built on robust Supabase architecture to ensure your field tickets are instantly accessible.' },
                  { icon: 'analytics', color: '#16a34a', bg: '#f0fdf4', title: 'Strength Forecaster', desc: 'Project 7-day and 28-day concrete cylinder breaks dynamically based on live batch data.' },
                  { icon: 'shield-checkmark', color: '#d97706', bg: '#fef3c7', title: 'Enterprise Secure', desc: 'Strict role-based authentication guarding sensitive project logs and testing records.' }
                ].map((feat, i) => (
                  <View key={i} style={[styles.featureCard, isMobile && { maxWidth: '100%' }]}>
                    <View style={[styles.featureIcon, { backgroundColor: feat.bg }]}><Ionicons name={feat.icon as any} size={22} color={feat.color} /></View>
                    <Text style={styles.featureTitle}>{feat.title}</Text>
                    <Text style={styles.featureDesc}>{feat.desc}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ABOUT TAB VIEW */}
          {activeTab === 'about' && (
            <View style={styles.staticPageContainer}>
              <Text style={[styles.pageTitle, isMobile && { fontSize: 32 }]}>Engineered for the Field.</Text>
              <Text style={styles.pageBody}>TEPUY QC was built out of firsthand field experience in geotechnical and construction materials testing. Managing concrete slump tests, air content, cylinder casting, and truck tickets on crumpled paper pads introduces massive operational friction and human error.</Text>
              <Text style={styles.pageBody}>Our mission is to bridge the gap between heavy civil engineering and modern cloud software. By leveraging edge OCR parsing and instant database synchronization, TEPUY QC saves engineering firms hours of administrative rework every single week.</Text>
              
              <View style={[styles.statBoxRow, isMobile && { flexDirection: 'column' }]}>
                <View style={styles.statBox}><Text style={styles.statNumber}>100%</Text><Text style={styles.statLabel}>Digital Workflow</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Transcription Errors</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>24/7</Text><Text style={styles.statLabel}>Cloud Availability</Text></View>
              </View>
            </View>
          )}

          {/* CONTACT TAB VIEW */}
          {activeTab === 'contact' && (
            <View style={styles.staticPageContainer}>
              <Text style={[styles.pageTitle, isMobile && { fontSize: 32 }]}>Let's Build Together.</Text>
              <Text style={styles.pageSubtitleContact}>Have questions about enterprise deployment, custom OCR integrations, or partnership opportunities? Drop us a line below.</Text>

              <View style={[styles.contactFormCard, isMobile && { padding: 20 }]}>
                {submitted ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
                    <Text style={styles.successTitle}>Message Received!</Text>
                    <Text style={styles.successDesc}>Thank you for reaching out. An engineering representative will contact you shortly.</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>Your Name</Text>
                    <TextInput style={styles.textInput} placeholder="e.g., Sarah Jenkins" value={contactForm.name} onChangeText={(val) => setContactForm({ ...contactForm, name: val })} />
                    <Text style={styles.inputLabel}>Work Email *</Text>
                    <TextInput style={styles.textInput} placeholder="e.g., s.jenkins@engineering.com" value={contactForm.email} onChangeText={(val) => setContactForm({ ...contactForm, email: val })} />
                    <Text style={styles.inputLabel}>Message *</Text>
                    <TextInput style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]} placeholder="Tell us about your project or inquiry..." multiline value={contactForm.message} onChangeText={(val) => setContactForm({ ...contactForm, message: val })} />
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} TEPUY QC. Enterprise Quality Assurance Systems.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', zIndex: 10 },
  logoContainer: { cursor: 'pointer' as any },
  logoImage: { width: 140, height: 36 },
  mobileMenuBtn: { padding: 8 },
  navMenu: { flexDirection: 'row', gap: 8, backgroundColor: '#f1f5f9', padding: 4, borderRadius: 10 },
  navLink: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
  navLinkActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  navLinkText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  navLinkTextActive: { color: '#0f172a' },
  loginButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  loginButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  mobileDropdown: { backgroundColor: '#ffffff', position: 'absolute', top: 64, left: 0, right: 0, padding: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', zIndex: 9, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  mobileDropdownItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  mobileDropdownText: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  mobileDropdownTextActive: { color: '#0284c7' },
  
  scrollContent: { paddingBottom: 60 },
  heroSection: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 70, paddingBottom: 40 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  badgeText: { color: '#0369a1', fontSize: 13, fontWeight: '600' },
  heroTitle: { fontSize: 52, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 20, maxWidth: 900, letterSpacing: -1 },
  heroSubtitle: { fontSize: 18, color: '#475569', textAlign: 'center', maxWidth: 680, lineHeight: 28, marginBottom: 36 },
  ctaRow: { flexDirection: 'row', gap: 16 },
  primaryCta: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, shadowColor: '#0284c7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, marginBottom: 12 },
  primaryCtaText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryCta: { justifyContent: 'center', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
  secondaryCtaText: { color: '#334155', fontSize: 16, fontWeight: '600' },

  demoSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 50 },
  sectionHeading: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 24, letterSpacing: -0.5 },

  forecasterSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 60 },
  forecasterCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 700, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
  forecasterHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16 },
  forecasterIconBox: { backgroundColor: '#f0fdf4', padding: 10, borderRadius: 10 },
  forecasterTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  forecasterSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  forecasterBody: { flexDirection: 'row', gap: 24, alignItems: 'center' },
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

  featuresContainer: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingHorizontal: 32, marginBottom: 60 },
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
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 16 },
  textInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#0f172a' },
  submitButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, borderRadius: 8, marginTop: 28 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  successBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  successDesc: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },

  footer: { paddingVertical: 36, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', marginTop: 40 },
  footerText: { fontSize: 13, color: '#94a3b8', textAlign: 'center', paddingHorizontal: 20 }
});