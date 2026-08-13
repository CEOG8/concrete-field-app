import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function FieldTicketEntry() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [slump, setSlump] = useState('');
  const [temp, setTemp] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  
  const [castCylinders, setCastCylinders] = useState(false);
  const [cylinderCount, setCylinderCount] = useState('4');

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // OCR and Image State
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const slumpNum = parseFloat(slump);
  const tempNum = parseFloat(temp);
  const isSlumpValid = isNaN(slumpNum) || (slumpNum >= 3.0 && slumpNum <= 6.0);
  const isTempValid = isNaN(tempNum) || (tempNum >= 50 && tempNum <= 90);

  useEffect(() => {
    async function loadUserCompany() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setCompanyId(profile.company_id);
        }
      }
      setInitializing(false);
    }
    loadUserCompany();
  }, []);

  async function pickAndScanTicket() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      simulateTicketOCR();
    }
  }

  function simulateTicketOCR() {
    setIsScanning(true);
    setTimeout(() => {
      setProjectNumber('VICTORIA BRIDGE');
      setTicketNumber('84158');
      setTruckNumber('6813');
      setSlump('5');
      setTemp('72');
      setIsScanning(false);
      Alert.alert('OCR Extraction Complete', 'Data successfully extracted. Please review fields for accuracy.');
    }, 2500);
  }

  async function handleSubmit() {
    if (!ticketNumber || !truckNumber) {
      Alert.alert('Missing Fields', 'Please fill out the Ticket Number and Truck Number.');
      return;
    }

    if (!companyId) {
      Alert.alert('System Error', 'Your account is missing a Company ID. Cannot save data.');
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = null;

      // NEW: Upload the image to Supabase Storage before saving the ticket
      if (imageUri) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileName = `${companyId}/${Date.now()}-ticket.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('ticket_scans')
            .upload(fileName, blob, { contentType: 'image/jpeg' });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('ticket_scans')
            .getPublicUrl(fileName);

          uploadedImageUrl = publicUrlData.publicUrl;
        } catch (err) {
          console.error("Image upload failed:", err);
          Alert.alert("Upload Warning", "The image failed to upload to the server, but we will still save the text data.");
        }
      }

      // Save the ticket text data AND the new image URL
      const { data: ticketData, error: ticketError } = await supabase
        .from('concrete_tickets')
        .insert([{
            ticket_number: ticketNumber,
            truck_number: truckNumber,
            slump: slumpNum || null,
            temperature: tempNum || null,
            project_number: projectNumber || 'PROJ-DEFAULT',
            company_id: companyId,
            image_url: uploadedImageUrl // Attached here!
        }])
        .select()
        .single();

      if (ticketError) throw ticketError;

      if (castCylinders && ticketData) {
        const { data: setatisData, error: setError } = await supabase
          .from('cylinder_sets')
          .insert([{
              ticket_id: ticketData.id,
              project_number: projectNumber || 'PROJ-DEFAULT',
              company_id: companyId
          }])
          .select()
          .single();

        if (setError) throw setError;

        if (setatisData) {
          const count = parseInt(cylinderCount, 10) || 4;
          const targetDaysList = [1, 7, 14, 28, 56]; 
          const breakRecords = [];

          for (let i = 0; i < count; i++) {
            const targetDays = targetDaysList[i % targetDaysList.length];
            const breakDate = new Date();
            breakDate.setDate(breakDate.getDate() + targetDays);
            breakRecords.push({
              set_id: setatisData.id,
              target_days: targetDays,
              break_date: breakDate.toISOString().split('T')[0],
              company_id: companyId
            });
          }

          const { error: breakError } = await supabase.from('cylinder_breaks').insert(breakRecords);
          if (breakError) throw breakError;
        }
      }

      Alert.alert('Success', 'Field Ticket and Scan safely saved to your enterprise workspace!');
      
      setTicketNumber('');
      setTruckNumber('');
      setSlump('');
      setTemp('');
      setCastCylinders(false);
      setCylinderCount('4');
      setImageUri(null); 
    } catch (error: any) {
      Alert.alert('Submission Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (initializing) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="shield-checkmark" size={28} color="#0284c7" />
          <View>
            <Text style={styles.title}>Field Ticket Entry</Text>
            <Text style={styles.subtitle}>Enterprise secure data entry.</Text>
          </View>
        </View>

        <View style={styles.ocrBox}>
          <TouchableOpacity style={styles.scanButton} onPress={pickAndScanTicket} disabled={isScanning}>
            <Ionicons name="scan-outline" size={20} color="#0284c7" />
            <Text style={styles.scanButtonText}>{isScanning ? 'Extracting Data via AI...' : 'Scan Paper Ticket (OCR)'}</Text>
          </TouchableOpacity>
          {isScanning && (
            <View style={styles.scanningIndicator}>
              <ActivityIndicator size="small" color="#0284c7" />
              <Text style={styles.scanningText}>Analyzing document layout...</Text>
            </View>
          )}
          {imageUri && !isScanning && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imageLabel}>Attached Ticket</Text>
              <Image source={{ uri: imageUri }} style={styles.ticketImage} />
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Project Number</Text>
          <TextInput style={styles.input} placeholder="e.g., TEP-2026-01" value={projectNumber} onChangeText={setProjectNumber} />
        </View>
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Ticket Number</Text>
            <TextInput style={styles.input} placeholder="e.g., TC-99420" value={ticketNumber} onChangeText={setTicketNumber} />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Truck Number</Text>
            <TextInput style={styles.input} placeholder="e.g., Truck #42" value={truckNumber} onChangeText={setTruckNumber} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Slump (inches)</Text>
            <TextInput style={[styles.input, !isSlumpValid && styles.errorInput]} placeholder="e.g., 4.5" keyboardType="numeric" value={slump} onChangeText={setSlump} />
            {!isSlumpValid && <Text style={styles.errorText}>Out of ASTM specification range!</Text>}
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Temperature (°F)</Text>
            <TextInput style={[styles.input, !isTempValid && styles.errorInput]} placeholder="e.g., 82" keyboardType="numeric" value={temp} onChangeText={setTemp} />
            {!isTempValid && <Text style={styles.errorText}>Temperature out of range!</Text>}
          </View>
        </View>

        <View style={styles.cylinderBox}>
          <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="flask-outline" size={20} color="#0369a1" />
              <Text style={styles.cylinderTitle}>Cast Quality Control Cylinders?</Text>
            </View>
            <Switch value={castCylinders} onValueChange={setCastCylinders} trackColor={{ false: '#cbd5e1', true: '#38bdf8' }} thumbColor={castCylinders ? '#0284c7' : '#f1f5f9'} />
          </View>
          {castCylinders && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Number of Cylinders Cast</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={cylinderCount} onChangeText={(text) => setCylinderCount(text.replace(/[^0-9]/g, ''))} placeholder="4" />
              <Text style={styles.helperText}>Automatically generates and isolates an enterprise mix schedule.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Ticket & Cylinders</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  container: { padding: 20, backgroundColor: '#0f172a', alignItems: 'center', flexGrow: 1 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 700, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  ocrBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, borderStyle: 'dashed' },
  scanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#e0f2fe', borderRadius: 8 },
  scanButtonText: { color: '#0284c7', fontWeight: 'bold', fontSize: 15 },
  scanningIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  scanningText: { color: '#0284c7', fontSize: 13, fontStyle: 'italic' },
  imagePreviewContainer: { marginTop: 16, alignItems: 'center' },
  imageLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
  ticketImage: { width: 120, height: 160, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  row: { flexDirection: 'row', gap: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 15, color: '#0f172a' },
  errorInput: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  errorText: { color: '#ef4444', fontSize: 11, marginTop: 4 },
  cylinderBox: { backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderRadius: 12, padding: 16, marginBottom: 20 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cylinderTitle: { fontSize: 15, fontWeight: 'bold', color: '#0369a1' },
  helperText: { fontSize: 11, color: '#64748b', marginTop: 6 },
  submitButton: { backgroundColor: '#0284c7', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});