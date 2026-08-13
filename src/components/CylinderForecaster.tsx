import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CylinderForecaster() {
  // --- Engineering Logic Section ---
  // Defaulting to a standard 3000 PSI 7-day break
  const [sevenDayStrength, setSevenDayStrength] = useState(3000);

  // Projection Factor: Standard estimation for Type I/II cement is that
  // 7-day strength is approx 65-75% of 28-day strength. We'll use 70% (0.7).
  // Formula: 28-Day = 7-Day / 0.7 (or roughly 7-Day * 1.43)
  const projectionFactor = 0.70;
  
  // Dynamic calculation based on state
  const projectedTwentyEightDay = Math.round(sevenDayStrength / projectionFactor);

  // Functions to adjust input via buttons
  const adjustStrength = (amount: number) => {
    setSevenDayStrength((prev) => {
      const next = prev + amount;
      if (next < 500) return 500; // Hard lower limit (it's not even mud-slab)
      if (next > 8000) return 8000; // Hard upper limit for demo
      return next;
    });
  };

  const getTargetMessage = () => {
    if (projectedTwentyEightDay < 3000) return { text: "Below Class A Standard", color: "#f97316" }; // Orange
    if (projectedTwentyEightDay < 5000) return { text: "Meets Class A/A1 Standard", color: "#10b981" }; // Green
    return { text: "High-Strength Performance Mix", color: "#2563eb" }; // Blue
  };

  const status = getTargetMessage();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cylinder Strength Forecaster</Text>
      <Text style={styles.subHeader}>
        Enter a 7-day compressive break to view the projected 28-day ultimate strength (ACI 318 estimation).
      </Text>

      {/* Input Section */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Measured 7-Day Breaking Strength</Text>
        <View style={styles.valueRow}>
          <Text style={styles.mainValue}>{sevenDayStrength.toLocaleString()}</Text>
          <Text style={styles.unit}>PSI</Text>
        </View>
        
        {/* Adjustment Buttons (Simpler for web demo than a slider) */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={() => adjustStrength(-250)}>
            <Text style={styles.controlButtonText}>- 250</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => adjustStrength(-50)}>
            <Text style={styles.controlButtonText}>- 50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => adjustStrength(50)}>
            <Text style={styles.controlButtonText}>+ 50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => adjustStrength(250)}>
            <Text style={styles.controlButtonText}>+ 250</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Result Section */}
      <View style={[styles.card, styles.resultCard]}>
        <Text style={[styles.cardLabel, styles.resultLabel]}>Projected 28-Day Strength</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.mainValue, styles.resultValue]}>{projectedTwentyEightDay.toLocaleString()}</Text>
          <Text style={[styles.unit, styles.resultUnit]}>PSI</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>
      
      <Text style={styles.disclaimer}>
        *Note: This is a mathematical estimation using standard cure curves. Actual 28-day strengths depend heavily on mix design, Type of cement, temperature, and field curing conditions. Refer to physical ASTM C39 breaks for official compliance.
      </Text>
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    marginBottom: 32,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 6,
  },
  unit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94a3b8',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  controlButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  controlButtonText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#1e293b', // Dark blue
    borderColor: '#0f172a',
    marginBottom: 8,
  },
  resultLabel: {
    color: '#94a3b8',
  },
  resultValue: {
    color: '#ffffff',
  },
  resultUnit: {
    color: '#475569',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: -4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 16,
  },
});