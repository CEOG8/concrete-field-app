import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createWorker } from 'tesseract.js';
import { supabase } from '../../supabase'; // Ensure this path points to your Supabase client

export default function NewTicket() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  
  // Form State
  const [projectNumber, setProjectNumber] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [slump, setSlump] = useState('');
  const [temperature, setTemperature] = useState('');
  
  // Cylinders State
  const [castCylinders, setCastCylinders] = useState(false);
  const [numberOfCylinders, setNumberOfCylinders] = useState('4');

  const handleScan = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      setIsScanning(true);
      setScanStatus('Initializing OCR Engine...');

      const imageUri = result.assets[0].uri;

      // Web requires CDN workers to bypass browser security, Native can use default
      const workerOptions = Platform.OS === 'web' ? {
        workerPath: 'https://unpkg.com/tesseract.js@v5.0.0/dist/worker.min.js',
        corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
      } : {};

      const worker = await createWorker('eng', 1, workerOptions);
      
      setScanStatus('Scanning ticket data...');
      const ret = await worker.recognize(imageUri);
      await worker.terminate();

      const text = ret.data.text;
      console.log("Raw OCR Text:", text); // For debugging in your console

      // --- ADVANCED CONCRETE TICKET PARSING REGEX ---
      
      // 1. Find Truck Number (e.g., "Truck 76", "Truck: 76", "Trk 42")
      const truckMatch = text.match(/(?:Truck|Trk)[\s:]*([0-9]+)/i);
      if (truckMatch && truckMatch[1]) setTruckNumber(truckMatch[1]);

      // 2. Find Slump (e.g., "Slump: 6.00 in", "Slump 4.5")
      const slumpMatch = text.match(/Slump[\s:]*([0-9.]+)/i);
      if (slumpMatch && slumpMatch[1]) setSlump(slumpMatch[1]);

      // 3. Find Temperature (e.g., "Temp: 82F", "Temperature 80")
      const tempMatch = text.match(/Temp(?:erature)?[\s:]*([0-9.]+)/i);
      if (tempMatch && tempMatch[1]) setTemperature(tempMatch[1]);

      // 4. Find Ticket/Load Number (Usually a prominent 5 or 6 digit number)
      const ticketMatch = text.match(/Ticket[\s:]*([0-9A-Z-]+)/i) || text.match(/Load[\s:]*([0-9]{4,})/i);
      if (ticketMatch && ticketMatch[1]) {
        setTicketNumber(ticketMatch[1]);
      } else {
        // Fallback: Grab the first 5+ digit number found
        const fallbackTicket = text.match(/\b([0-9]{5,})\b/);
        if (fallbackTicket && fallbackTicket[1]) setTicketNumber(fallbackTicket[1]);
      }

      setIsScanning(false);
      setScanStatus('');

    } catch (error) {
      console.error("OCR Failed:", error);
      setIsScanning(false);
      Alert.alert("Scan Failed", "Could not extract text. Please enter data manually.");
    }
  };

  const handleSubmit = async () => {
    if (!ticketNumber || !truckNumber) {
      Alert.alert("Missing Data", "Please ensure Ticket Number and Truck Number are filled.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      // Save to Supabase (Adjust table name 'tickets' to match your actual database schema)
      const { error } = await supabase.from('tickets').insert([{
        user_id: user.id,
        project_number: projectNumber,
        ticket_number: ticketNumber,
        truck_number: truckNumber,
        slump: parseFloat(slump) || null,
        temperature: parseFloat(temperature) || null,
        cylinders_cast: castCylinders ? parseInt(numberOfCylinders) : 0,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      Alert.alert("Success", "Ticket logged successfully!");
      router.push('/history');

    } catch (error: any) {
      Alert.alert("Database Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.title}>Field Ticket Entry</Text>
            <Text style={styles.subtitle}>Enterprise secure data entry.</Text>
          </View>
        </View>

        {/* OCR SCAN BUTTON */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={isScanning}>
          {isScanning ? (
            <View style={styles.scanningRow}>
              <ActivityIndicator size="small" color="#0284c7" />
              <Text style={styles.scanButtonText}>{scanStatus}</Text>
            </View>
          ) : (
            <View style={styles.scanningRow}>
              <Ionicons name="scan-outline" size={20} color="#0284c7" />
              <Text style={styles.scanButtonText}>Scan Paper Ticket (OCR)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FORM FIELDS */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Project Number</Text>
          <TextInput style={styles.input} placeholder="e.g., TEP-2026-01" value={projectNumber} onChangeText={setProjectNumber} />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Ticket Number</Text>
            <TextInput style={styles.input} placeholder="e.g., TC-99420" value={ticketNumber} onChangeText={setTicketNumber} />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Truck Number</Text>
            <TextInput style={styles.input} placeholder="e.g., 42" value={truckNumber} onChangeText={setTruckNumber} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Slump (inches)</Text>
            <TextInput style={styles.input} placeholder="e.g., 4.5" value={slump} onChangeText={setSlump} keyboardType="numeric" />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Temperature (°F)</Text>
            <TextInput style={styles.input} placeholder="e.g., 82" value={temperature} onChangeText={setTemperature} keyboardType="numeric" />
          </View>
        </View>

        {/* CYLINDER TOGGLE */}
        <View style={styles.cylinderBox}>
          <View style={styles.cylinderHeader}>
            <View style={styles.cylinderTitleRow}>
              <Ionicons name="flask-outline" size={20} color="#0284c7" />
              <Text style={styles.cylinderTitle}>Cast Quality Control Cylinders?</Text>
            </View>
            <Switch value={castCylinders} onValueChange={setCastCylinders} trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }} thumbColor={castCylinders ? '#0284c7' : '#f8fafc'} />
          </View>

          {castCylinders && (
            <View style={styles.cylinderDetails}>
              <Text style={styles.label}>Number of Cylinders Cast</Text>
              <TextInput style={styles.input} value={numberOfCylinders} onChangeText={setNumberOfCylinders} keyboardType="numeric" />
              <Text style={styles.helperText}>Automatically generates and isolates an enterprise mix schedule.</Text>
            </View>
          )}
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Ticket & Cylinders</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: 750, borderRadius: 12, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  iconBox: { backgroundColor: '#0284c7', padding: 12, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
  
  scanButton: { backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderStyle: 'dashed', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 24 },
  scanningRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scanButtonText: { color: '#0284c7', fontSize: 16, fontWeight: '600' },

  formGroup: { marginBottom: 20 },
  row: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#0f172a' },

  cylinderBox: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24 },
  cylinderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cylinderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cylinderTitle: { fontSize: 15, fontWeight: 'bold', color: '#0284c7' },
  cylinderDetails: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  helperText: { fontSize: 12, color: '#64748b', marginTop: 8 },

  submitBtn: { backgroundColor: '#0284c7', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});