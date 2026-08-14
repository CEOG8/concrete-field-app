import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import OcrDemo from '../components/OcrDemo';

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact'>('home');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = () => {
    if (!contactForm.email || !contactForm.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Enterprise Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.logoRow} onTouchEnd={() => setActiveTab('home')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
          </View>
          <Text style={styles.logoText}>TEPUY QC</Text>
        </View>

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
        >
          <Ionicons name="log-in-outline" size={16} color="#ffffff" />
          <Text style={styles.loginButtonText}>Enterprise Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HOME TAB VIEW */}
        {activeTab === 'home' && (
          <>
            <View style={styles.heroSection}>
              <View style={styles.badgeRow}>
                <Ionicons name="flash" size={14} color="#0284c7" />
                <Text style={styles.badgeText}>Next-Gen Construction Quality Control</Text>
              </View>
              
              <Text style={styles.heroTitle}>Digitize Your Concrete Testing</Text>
              <Text style={styles.heroSubtitle}>
                Eliminate manual paperwork, eradicate transcription errors, and sync field data directly into your secure cloud database in seconds.
              </Text>

              <View style={styles.ctaRow}>
                <TouchableOpacity style={styles.primaryCta} onPress={() => router.push('/new-ticket')}>
                  <Text style={styles.primaryCtaText}>Launch Field Portal</Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryCta} onPress={() => setActiveTab('about')}>
                  <Text style={styles.secondaryCtaText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Interactive OCR Demo Component */}
            <View style={styles.demoSection}>
              <Text style={styles.sectionHeading}>Interactive Product Preview</Text>
              <OcrDemo />
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
            <Text style={styles.pageTitle}>About TEPUY QC</Text>
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
            <Text style={styles.pageTitle}>Get in Touch</Text>
            <Text style={styles.pageSubtitleContact}>
              Have questions about enterprise deployment, custom OCR integrations, or partnership opportunities? Drop us a line below.
            </Text>

            <View style={styles.contactFormCard}>
              {submitted ? (
                <View style={styles.successBox}>
                  <Ionicons name="checkmark-circle" size={40} color="#16a34a" />
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

                  <TouchableOpacity style={styles.submitButton} onPress={handleContactSubmit}>
                    <Text style={styles.submitButtonText}>Send Message</Text>
                    <Ionicons name="send" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, cursor: 'pointer' as any },
  iconWrapper: { backgroundColor: '#0284c7', padding: 6, borderRadius: 8 },
  logoText: { color: '#0f172a', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  navMenu: { flexDirection: 'row', gap: 8, backgroundColor: '#f1f5f9', padding: 4, borderRadius: 10 },
  navLink: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  navLinkActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  navLinkText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  navLinkTextActive: { color: '#0f172a' },
  loginButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  loginButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  
  scrollContent: { paddingBottom: 60 },
  
  heroSection: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  badgeText: { color: '#0369a1', fontSize: 13, fontWeight: '600' },
  heroTitle: { fontSize: 42, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 16, maxWidth: 800 },
  heroSubtitle: { fontSize: 18, color: '#475569', textAlign: 'center', maxWidth: 650, lineHeight: 28, marginBottom: 32 },
  
  ctaRow: { flexDirection: 'row', gap: 16 },
  primaryCta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, shadowColor: '#0284c7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  primaryCtaText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryCta: { justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
  secondaryCtaText: { color: '#334155', fontSize: 16, fontWeight: '600' },

  demoSection: { alignItems: 'center', paddingHorizontal: 24, marginBottom: 60 },
  sectionHeading: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 },

  featuresContainer: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', justifyContent: 'center', gap: 24, paddingHorizontal: 32, marginBottom: 60 },
  featureCard: { flex: 1, maxWidth: 320, backgroundColor: '#ffffff', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
  featureIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 20 },

  staticPageContainer: { width: '100%', maxWidth: 750, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 20, textAlign: 'center' },
  pageSubtitleContact: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  pageBody: { fontSize: 16, color: '#475569', lineHeight: 26, marginBottom: 20 },
  
  statBoxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 16 },
  statBox: { flex: 1, backgroundColor: '#ffffff', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#0284c7', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  contactFormCard: { backgroundColor: '#ffffff', padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 16 },
  textInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#0f172a' },
  submitButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingVertical: 14, borderRadius: 8, marginTop: 24 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  successBox: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  successDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },

  footer: { paddingVertical: 32, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', marginTop: 40 },
  footerText: { fontSize: 13, color: '#94a3b8' }
});