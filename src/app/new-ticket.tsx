import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TicketForm() {
  const [castCylinders, setCastCylinders] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconWrapper}>
            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Field Ticket Entry</Text>
            <Text style={styles.subtitle}>Enterprise secure data entry.</Text>
          </View>
        </View>

        {/* OCR Scan Button */}
        <TouchableOpacity style={styles.ocrButton}>
          <Ionicons name="scan-outline" size={18} color="#0284c7" />
          <Text style={styles.ocrButtonText}>Scan Paper Ticket (OCR)</Text>
        </TouchableOpacity>

        {/* Core Ticket Data */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Project Number</Text>
          <TextInput style={styles.input} placeholder="e.g., TEP-2026-01" placeholderTextColor="#94a3b8" />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Ticket Number</Text>
            <TextInput style={styles.input} placeholder="e.g., TC-99420" placeholderTextColor="#94a3b8" />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Truck Number</Text>
            <TextInput style={styles.input} placeholder="e.g., Truck #42" placeholderTextColor="#94a3b8" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Slump (inches)</Text>
            <TextInput style={styles.input} placeholder="e.g., 4.5" placeholderTextColor="#94a3b8" />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Temperature (°F)</Text>
            <TextInput style={styles.input} placeholder="e.g., 82" placeholderTextColor="#94a3b8" />
          </View>
        </View>

        {/* Cylinder Quality Control Section */}
        <View style={styles.cylinderSection}>
          <View style={styles.cylinderHeader}>
            <View style={styles.cylinderTitleRow}>
              <Ionicons name="flask-outline" size={18} color="#0284c7" />
              <Text style={styles.cylinderTitle}>Cast Quality Control Cylinders?</Text>
            </View>
            <Switch
              value={castCylinders}
              onValueChange={setCastCylinders}
              trackColor={{ false: '#cbd5e1', true: '#0284c7' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          {castCylinders && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Number of Cylinders Cast</Text>
              <TextInput style={styles.input} value="4" keyboardType="numeric" />
              <Text style={styles.helperText}>Automatically generates and isolates an enterprise mix schedule.</Text>
            </View>
          )}
        </View>

        {/* Submit Action */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Ticket & Cylinders</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 700,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    backgroundColor: '#0284c7',
    padding: 6,
    borderRadius: 8,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  ocrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderStyle: 'dashed',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  ocrButtonText: {
    color: '#0284c7',
    fontWeight: '600',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 12,
    fontSize: 14,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cylinderSection: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  cylinderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cylinderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cylinderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  helperText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});