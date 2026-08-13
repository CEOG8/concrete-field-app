import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OcrDemo() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="scan-circle" size={24} color="#0284c7" />
        <Text style={styles.title}>Live OCR Extraction</Text>
      </View>
      
      <Text style={styles.description}>
        Watch how TEPUY QC instantly digitizes crumpled, stained paper tickets from the field.
      </Text>

      <View style={styles.demoArea}>
        <View style={styles.imageContainer}>
          {/* THE REAL LOCAL TICKET IMAGE IS BACK */}
          <Image 
            source={require('../../assets/images/ticket-sample.png')} 
            style={styles.ticketImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.actionContainer}>
          {!hasScanned && !isScanning && (
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Ionicons name="scan" size={20} color="#ffffff" />
              <Text style={styles.scanButtonText}>Extract Data</Text>
            </TouchableOpacity>
          )}

          {isScanning && (
            <View style={styles.scanningState}>
              <ActivityIndicator size="small" color="#0284c7" />
              <Text style={styles.scanningText}>Processing via Cloud Vision...</Text>
            </View>
          )}

          {hasScanned && (
            <View style={styles.resultsContainer}>
              <View style={styles.resultBadge}>
                <Text style={styles.resultLabel}>Ticket:</Text>
                <Text style={styles.resultValue}>TC-99420</Text>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultLabel}>Slump:</Text>
                <Text style={styles.resultValue}>4.5 in</Text>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultLabel}>Truck:</Text>
                <Text style={styles.resultValue}>#42</Text>
              </View>
              
              <TouchableOpacity style={styles.resetButton} onPress={() => setHasScanned(false)}>
                <Ionicons name="refresh" size={16} color="#64748b" />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 700, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3, borderWidth: 1, borderColor: '#e2e8f0' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  description: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  demoArea: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 20, alignItems: 'center' },
  imageContainer: { flex: 1, width: '100%', height: 200, backgroundColor: '#f1f5f9', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  ticketImage: { width: '100%', height: '100%' },
  actionContainer: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', minHeight: 120 },
  scanButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0284c7', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  scanButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  scanningState: { alignItems: 'center', gap: 12 },
  scanningText: { color: '#0284c7', fontWeight: '600', fontSize: 14 },
  resultsContainer: { width: '100%', gap: 8 },
  resultBadge: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0f9ff', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#bae6fd' },
  resultLabel: { color: '#475569', fontSize: 13, fontWeight: '600' },
  resultValue: { color: '#0369a1', fontSize: 14, fontWeight: 'bold' },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  resetText: { color: '#64748b', fontSize: 14, fontWeight: '600' }
});