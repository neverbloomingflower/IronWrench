import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';
import { diagnoseProblem, type DiagnosisResult } from '../src/services/anthropic';
import { DIAGNOSTIC_SYMPTOMS } from '../src/data/bikes';

type Mode = 'describe' | 'symptoms' | 'history';

const HISTORY = [
  { date: 'March 28, 2026', bike: 'Sporty 883', issue: 'Idle Tick', severity: 'moderate' as const, diagnosis: 'Exhaust header leak at cylinder head. Head bolts were loose after heat cycling.' },
  { date: 'Feb 14, 2026', bike: 'Dyna Wide Glide', issue: 'Hard Cold Start', severity: 'minor' as const, diagnosis: 'Pilot jet clogged. Carb clean + main jet adjustment resolved it.' },
  { date: 'Jan 3, 2026', bike: 'Softail FXST', issue: 'Primary Oil Leak', severity: 'moderate' as const, diagnosis: 'Primary cover gasket had a crack near the inspection plug. Replaced gasket.' },
];

function SeverityBadge({ severity }: { severity: 'minor' | 'moderate' | 'serious' }) {
  const colors = {
    minor: { bg: '#0a1a00', border: Colors.successDark, text: Colors.success },
    moderate: { bg: '#1a1200', border: Colors.amberDark, text: Colors.amber },
    serious: { bg: '#1a0000', border: Colors.dangerDark, text: Colors.danger },
  };
  const c = colors[severity];
  return (
    <View style={[s.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[s.badgeText, { color: c.text }]}>{severity.toUpperCase()}</Text>
    </View>
  );
}

export default function DiagnosticScreen() {
  const [mode, setMode] = useState<Mode>('describe');
  const [description, setDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const runDiagnosis = async () => {
    const text = mode === 'describe'
      ? description.trim()
      : Array.from(selectedSymptoms).join(', ');
    if (!text) {
      Alert.alert('Describe the problem', mode === 'describe' ? 'Type a description first.' : 'Select at least one symptom.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await diagnoseProblem(text);
      setResult(res);
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach AI. Check your API key in src/theme.ts');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Engine <Text style={s.headerAccent}>Diagnostics</Text></Text>
        <Text style={s.headerSub}>Describe it. Our AI knows cruiser iron.</Text>
      </View>

      {/* Mode tabs */}
      <View style={s.tabs}>
        {(['describe', 'symptoms', 'history'] as Mode[]).map(m => (
          <TouchableOpacity key={m} style={[s.tab, mode === m && s.tabActive]} onPress={() => { setMode(m); setResult(null); }} activeOpacity={0.7}>
            <Text style={[s.tabText, mode === m && s.tabTextActive]}>
              {m === 'describe' ? 'Describe It' : m === 'symptoms' ? 'Symptoms' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* DESCRIBE MODE */}
        {mode === 'describe' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>What's your bike doing?</Text>
            <Text style={s.sectionSub}>Be specific — when does it happen, what does it sound like, any recent work done?</Text>
            <TextInput
              style={s.textarea}
              placeholder={"e.g. 'Clicking sound at idle that goes away when warm' or 'Won't start in cold weather, cranks fine, no spark' or 'Vibrates badly above 60mph, worse on right side'"}
              placeholderTextColor={Colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={s.quickTips}>
              <Text style={s.quickTipsLabel}>Quick Examples</Text>
              {['Ticking at idle', 'Hard cold start', 'Backfires on decel', 'Primary oil leak', 'Clutch slipping'].map(tip => (
                <TouchableOpacity key={tip} style={s.tipChip} onPress={() => setDescription(tip)} activeOpacity={0.7}>
                  <Text style={s.tipChipText}>{tip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* SYMPTOMS MODE */}
        {mode === 'symptoms' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Select Symptoms</Text>
            <Text style={s.sectionSub}>Pick everything that applies — the more you select, the better the diagnosis.</Text>
            <View style={s.symptomsGrid}>
              {DIAGNOSTIC_SYMPTOMS.map(sym => (
                <TouchableOpacity
                  key={sym}
                  style={[s.symptomChip, selectedSymptoms.has(sym) && s.symptomChipSelected]}
                  onPress={() => toggleSymptom(sym)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.symptomText, selectedSymptoms.has(sym) && s.symptomTextSelected]}>{sym}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* HISTORY MODE */}
        {mode === 'history' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Past Diagnoses</Text>
            {HISTORY.map((h, i) => (
              <View key={i} style={s.histItem}>
                <View style={s.histTop}>
                  <Text style={s.histDate}>{h.date}</Text>
                  <SeverityBadge severity={h.severity} />
                </View>
                <Text style={s.histTitle}>{h.bike} — {h.issue}</Text>
                <Text style={s.histDiag}>{h.diagnosis}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Diagnose button */}
        {mode !== 'history' && (
          <View style={s.btnWrap}>
            <TouchableOpacity style={s.diagnoseBtn} onPress={runDiagnosis} activeOpacity={0.8} disabled={loading}>
              {loading ? (
                <View style={s.loadingRow}>
                  <ActivityIndicator color={Colors.bg} size="small" />
                  <Text style={s.diagnoseBtnText}>AI Mechanic Thinking...</Text>
                </View>
              ) : (
                <Text style={s.diagnoseBtnText}>Diagnose with AI ↗</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* AI Result */}
        {result && (
          <View style={s.resultCard}>
            <View style={s.resultHeader}>
              <Text style={s.resultTag}>AI Diagnosis</Text>
              <SeverityBadge severity={result.severity} />
            </View>
            <Text style={s.resultBody}>{result.diagnosis}</Text>

            <View style={s.resultRow}>
              <Text style={s.resultRowLabel}>Most Likely Cause</Text>
              <Text style={s.resultRowVal}>{result.likelyCause}</Text>
            </View>
            <View style={s.resultRow}>
              <Text style={s.resultRowLabel}>Estimated Cost</Text>
              <Text style={[s.resultRowVal, { color: Colors.amber }]}>{result.estimatedCost}</Text>
            </View>
            <View style={s.resultRow}>
              <Text style={s.resultRowLabel}>DIY Friendly?</Text>
              <Text style={[s.resultRowVal, { color: result.diyFriendly ? Colors.success : Colors.danger }]}>
                {result.diyFriendly ? 'Yes — you can do this' : 'Recommend a shop'}
              </Text>
            </View>

            {result.nextSteps?.length > 0 && (
              <>
                <Text style={s.nextStepsLabel}>Next Steps</Text>
                {result.nextSteps.map((step, i) => (
                  <Text key={i} style={s.nextStep}>{i + 1}. {step}</Text>
                ))}
              </>
            )}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg2 },
  headerTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 32, letterSpacing: 1, color: Colors.off },
  headerAccent: { color: Colors.amber },
  headerSub: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke, marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.amber },
  tabText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.muted },
  tabTextActive: { color: Colors.amber },
  scroll: { flex: 1 },
  section: { padding: 16, gap: 10 },
  sectionTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 28, letterSpacing: 1, color: Colors.off },
  sectionSub: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke, lineHeight: 20 },
  textarea: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, color: Colors.off, fontFamily: 'Barlow-Regular', fontSize: 14, padding: 14, borderRadius: 4, minHeight: 130, lineHeight: 22 },
  quickTips: { gap: 8 },
  quickTipsLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: Colors.muted },
  tipChip: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 3 },
  tipChipText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 13, letterSpacing: 0.5, color: Colors.chrome },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  symptomChipSelected: { borderColor: Colors.amber, backgroundColor: '#1a1200' },
  symptomText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 13, letterSpacing: 0.5, color: Colors.chrome },
  symptomTextSelected: { color: Colors.amber },
  histItem: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 14, borderRadius: 4, gap: 6 },
  histTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  histDate: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.muted },
  histTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 15, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.off },
  histDiag: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke, lineHeight: 20 },
  btnWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  diagnoseBtn: { backgroundColor: Colors.amber, padding: 16, borderRadius: 3, alignItems: 'center' },
  loadingRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  diagnoseBtnText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 17, letterSpacing: 2, textTransform: 'uppercase', color: Colors.bg },
  badge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  badgeText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 1.5 },
  resultCard: { margin: 16, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, borderLeftColor: Colors.amber, padding: 16, borderRadius: 4, gap: 8 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultTag: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.amber },
  resultBody: { fontFamily: 'Barlow-Regular', fontSize: 14, color: Colors.chrome, lineHeight: 22 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  resultRowLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: Colors.smoke },
  resultRowVal: { fontFamily: 'Barlow-Medium', fontSize: 13, color: Colors.off, flex: 1, textAlign: 'right', marginLeft: 12 },
  nextStepsLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke, marginTop: 4 },
  nextStep: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.chrome, lineHeight: 20, paddingVertical: 2 },
});
