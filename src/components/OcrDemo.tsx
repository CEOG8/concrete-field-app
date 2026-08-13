import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OcrDemo() {
  // State to manage the scanning animation and results
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);

    // Simulate the AI processing time (2.5 seconds)
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const resetDemo = () => {
    setIsScanning(false);
    setScanComplete(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live AI Ticket Extraction</Text>
      <Text style={styles.subHeader}>Watch the system digitize handwritten field data in seconds.</Text>
      
      {/* Mock Ticket Image Area */}
      <View style={styles.imagePlaceholder}>
        <Image 
          source={require('../assets/images/ticket-sample.jpg')} 
          style={styles.ticketImage} 
          resizeMode="cover" 
        />
      </View>

      {/* Initial State: Show Scan Button */}
      {!scanComplete && !isScanning && (
        <TouchableOpacity style={styles.button} onPress={handleScan}>
          <Text style={styles.buttonText}>Scan Demo Ticket</Text>
        </TouchableOpacity>
      )}

      {/* Loading State: Show Spinner */}
      {isScanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Running optical character recognition...</Text>
        </View>
      )}

      {/* Success State: Show Extracted Data */}
      {scanComplete && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>Data Extracted Successfully</Text>
          
          <View style={styles.table}>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Truck No:</Text>
              <Text style={styles.value}>42</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Slump:</Text>
              <Text style={styles.value}>4.5 in</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Air Content:</Text>
              <Text style={styles.value}>6.2 %</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Time Batched:</Text>
              <Text style={styles.value}>08:15 AM</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetDemo}>
            <Text style={styles.resetButtonText}>Reset Demo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden', // This forces the image to respect the rounded corners
    marginBottom: 24,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  resultsContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
  },
  table: {
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontWeight: '600',
    color: '#475569',
  },
  value: {
    color: '#0f172a',
  },
  resetButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
});