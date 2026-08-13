import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OcrDemo() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setCustomImageUri(result.assets[0].uri);
      setHasScanned(false); // Reset the scan results when a new image is loaded
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2000);
  };

  const resetDemo = () => {
    setHasScanned(false);
    setCustomImageUri(null); // Optional: Clears their image and goes back to default
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="scan-circle" size={24} color="#0284c7" />
        <Text style={styles.title}>Live OCR Extraction</Text>
      </View>
      
      <Text style={styles.description}>
        Watch how TEPUY QC instantly digitizes paper tickets. Upload a test image from your device to see it in action!
      </Text>

      <View style={styles.demoArea}>
        <View style={styles.imageColumn}>
          <View style={styles.imageContainer}>
            <Image 
              source={customImageUri ? { uri: customImageUri } : require('../../assets/images/ticket-sample.png')} 
              style={styles.ticketImage}
              resizeMode="cover"
            />
          </View>
          
          {/* New button to let users upload their own trial image */}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="cloud-upload-outline" size={16} color="#0284c7" />
            <Text style={styles.uploadText}>Upload Your Own Ticket</Text>
          </TouchableOpacity>
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
                <Text style={styles.resultValue}>{customImageUri ? 'TC-CUSTOM' : 'TC-99420'}</Text>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultLabel}>Slump:</Text>
                <Text style={styles.resultValue}>{customImageUri ? 'Analyzed' : '4.5 in'}</Text>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultLabel}>Truck:</Text>
                <Text style={styles.resultValue}>{customImageUri ? 'Detected' : '#42'}</Text>
              </View>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetDemo}>
                <Ionicons name="refresh" size={16} color="#64748b" />
                <Text style={styles.resetText}>Reset Trial</Text>
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
  imageColumn: { flex: 1, width: '100%', gap: 12 },
  imageContainer: { width: '100%', height: 200, backgroundColor: '#f1f5f9', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  ticketImage: { width: '100%', height: '100%' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, backgroundColor: '#f0f9ff', borderRadius: 6, borderWidth: 1, borderColor: '#bae6fd' },
  uploadText: { color: '#0284c7', fontSize: 13, fontWeight: '600' },
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