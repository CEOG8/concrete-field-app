import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function History() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Track the advanced inputs (Target Days, Diameter, and Load) for each pending break
  const [breakInputs, setBreakInputs] = useState<{ [key: string]: { days: string, diameter: string, load: string } }>({});

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('concrete_tickets')
      .select(`
        *,
        cylinder_sets (
          id,
          company_id,
          cylinder_breaks (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error fetching data', error.message);
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  }

  const handleInputChange = (breakId: string, field: 'days' | 'diameter' | 'load', value: string) => {
    setBreakInputs(prev => ({
      ...prev,
      [breakId]: {
        ...(prev[breakId] || { days: '', diameter: '4.00', load: '' }),
        [field]: value.replace(/[^0-9.]/g, '') // Only allow numbers and decimals
      }
    }));
  };

  async function saveCylinderBreak(brk: any) {
    const inputs = breakInputs[brk.id] || { days: brk.target_days?.toString(), diameter: '4.00', load: '' };
    
    const loadNum = parseFloat(inputs.load);
    const diameterNum = parseFloat(inputs.diameter) || 4.00;
    const targetDaysNum = parseInt(inputs.days, 10) || brk.target_days;

    if (isNaN(loadNum) || loadNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid Max Load.');
      return;
    }

    // Advanced Math: Calculate precise area and PSI based on custom diameter
    const radius = diameterNum / 2;
    const preciseArea = Math.PI * Math.pow(radius, 2);
    const strengthPsi = Math.round(loadNum / preciseArea);

    const { error } = await supabase
      .from('cylinder_breaks')
      .update({ 
        target_days: targetDaysNum,
        diameter: diameterNum,
        area: parseFloat(preciseArea.toFixed(2)),
        max_load_lbs: loadNum, 
        strength_psi: strengthPsi 
      })
      .eq('id', brk.id);

    if (error) {
      Alert.alert('Save Error', error.message);
    } else {
      Alert.alert('Success', `Break recorded! Area: ${preciseArea.toFixed(2)} sq in | Strength: ${strengthPsi} PSI`);
      fetchHistory(); 
    }
  }

  // Feature: Add a new custom break to an existing set
  async function addCustomBreak(setId: string, companyId: string) {
    const { error } = await supabase
      .from('cylinder_breaks')
      .insert([{
        set_id: setId,
        company_id: companyId,
        target_days: 56, // Default placeholder for a hold cylinder
        break_date: new Date().toISOString().split('T')[0] 
      }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      fetchHistory(); // Refresh to show the new empty break row
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={28} color="#0284c7" />
        <View>
          <Text style={styles.title}>Lab Dashboard & History</Text>
          <Text style={styles.subtitle}>Review field pours and log precise cylinder breaks.</Text>
        </View>
      </View>

      {tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tickets found for your company.</Text>
        </View>
      ) : (
        tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCard}>
            
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(ticket.id)}>
              <View style={[styles.cardMainInfo, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectText}>Project: {ticket.project_number}</Text>
                  <Text style={styles.ticketText}>Ticket: {ticket.ticket_number} | Truck: {ticket.truck_number}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.badge}>Slump: {ticket.slump}"</Text>
                    <Text style={styles.badge}>Temp: {ticket.temperature}°F</Text>
                  </View>
                </View>
                
                {/* NEW: Show the scanned ticket thumbnail for verification */}
                {ticket.image_url && (
                  <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
                    <Ionicons name="document-attach" size={16} color="#64748b" style={{ marginBottom: 4 }} />
                    <Image 
                      source={{ uri: ticket.image_url }} 
                      style={{ width: 50, height: 70, borderRadius: 4, borderWidth: 1, borderColor: '#cbd5e1' }} 
                    />
                  </View>
                )}
              </View>
              <Ionicons name={expandedTicketId === ticket.id ? "chevron-up" : "chevron-down"} size={24} color="#64748b" />
            </TouchableOpacity>

            {expandedTicketId === ticket.id && ticket.cylinder_sets && ticket.cylinder_sets.length > 0 && (
              <View style={styles.cylinderSection}>
                <Text style={styles.sectionTitle}>Quality Control Cylinders</Text>
                
                {ticket.cylinder_sets[0].cylinder_breaks
                  .sort((a: any, b: any) => a.target_days - b.target_days)
                  .map((brk: any) => {
                    // Pre-fill the inputs if they haven't been touched yet
                    const inputs = breakInputs[brk.id] || { days: brk.target_days?.toString(), diameter: '4.00', load: '' };

                    return (
                      <View key={brk.id} style={styles.breakRow}>
                        
                        {/* If the break is completed, show the final locked data */}
                        {brk.strength_psi ? (
                          <View style={styles.completedBreakContainer}>
                            <View>
                              <Text style={styles.dayText}>{brk.target_days}-Day Break</Text>
                              <Text style={styles.dateText}>Area: {brk.area} sq in (Ø {brk.diameter}")</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={styles.resultText}>{brk.strength_psi} PSI</Text>
                              <Text style={styles.subResultText}>({brk.max_load_lbs} lbs)</Text>
                            </View>
                          </View>
                        ) : (
                          
                          /* If the break is pending, show the advanced lab inputs */
                          <View style={styles.pendingBreakContainer}>
                            <View style={styles.inputGrid}>
                              <View style={styles.inputCol}>
                                <Text style={styles.inputLabel}>Day</Text>
                                <TextInput
                                  style={styles.labInput}
                                  value={inputs.days}
                                  onChangeText={(val) => handleInputChange(brk.id, 'days', val)}
                                  keyboardType="numeric"
                                />
                              </View>
                              
                              <View style={styles.inputCol}>
                                <Text style={styles.inputLabel}>Diameter (in)</Text>
                                <TextInput
                                  style={styles.labInput}
                                  value={inputs.diameter}
                                  onChangeText={(val) => handleInputChange(brk.id, 'diameter', val)}
                                  keyboardType="numeric"
                                />
                              </View>

                              <View style={[styles.inputCol, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Max Load (lbs)</Text>
                                <TextInput
                                  style={styles.labInput}
                                  value={inputs.load}
                                  placeholder="e.g. 75000"
                                  onChangeText={(val) => handleInputChange(brk.id, 'load', val)}
                                  keyboardType="numeric"
                                />
                              </View>
                            </View>

                            <TouchableOpacity style={styles.saveBtn} onPress={() => saveCylinderBreak(brk)}>
                              <Text style={styles.saveBtnText}>Log Break</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })}
                
                {/* Dynamic Add Break Button */}
                <TouchableOpacity 
                  style={styles.addBreakBtn}
                  onPress={() => addCustomBreak(ticket.cylinder_sets[0].id, ticket.cylinder_sets[0].company_id)}
                >
                  <Ionicons name="add" size={18} color="#0284c7" />
                  <Text style={styles.addBreakText}>Add Extra Cylinder Break</Text>
                </TouchableOpacity>

              </View>
            )}
            
            {expandedTicketId === ticket.id && (!ticket.cylinder_sets || ticket.cylinder_sets.length === 0) && (
              <View style={styles.cylinderSection}>
                <Text style={styles.emptyText}>No cylinders cast for this pour.</Text>
              </View>
            )}

          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  container: { padding: 20, backgroundColor: '#0f172a', flexGrow: 1, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, width: '100%', maxWidth: 800 },
  title: { fontSize: 24, fontWeight: '900', color: '#ffffff' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 15 },
  ticketCard: { backgroundColor: '#ffffff', borderRadius: 12, width: '100%', maxWidth: 800, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#ffffff' },
  cardMainInfo: { flex: 1 },
  projectText: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  ticketText: { fontSize: 14, color: '#475569', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, color: '#334155', fontWeight: '600' },
  cylinderSection: { backgroundColor: '#f8fafc', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0369a1', marginBottom: 16 },
  breakRow: { backgroundColor: '#ffffff', borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  completedBreakContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#f0fdf4' },
  pendingBreakContainer: { padding: 16 },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputCol: { flex: 0.6 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748b', marginBottom: 4, textTransform: 'uppercase' },
  labInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: '#f8fafc', color: '#0f172a' },
  saveBtn: { backgroundColor: '#0284c7', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  dayText: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  dateText: { fontSize: 13, color: '#475569', marginTop: 2 },
  resultText: { fontSize: 18, fontWeight: '900', color: '#16a34a' },
  subResultText: { fontSize: 13, color: '#64748b', marginTop: 2 },
  addBreakBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 12, borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#38bdf8', backgroundColor: '#f0f9ff' },
  addBreakText: { color: '#0284c7', fontWeight: '600', fontSize: 14 }
});