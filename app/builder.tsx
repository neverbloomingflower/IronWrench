import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Ellipse, Rect } from 'react-native-svg';
import { Colors } from '../src/theme';
import { BIKES, BUILD_STYLES, MODS, type Bike, type Mod } from '../src/data/bikes';
import { getBuildRecommendations } from '../src/services/anthropic';

function BikeRenderer({ selectedMods }: { selectedMods: Mod[] }) {
  const hasApe = selectedMods.some(m => m.id === 'ape_hangers');
  const hasDrags = selectedMods.some(m => m.id === 'drag_pipes');
  return (
    <Svg width="100%" height={180} viewBox="0 0 320 180">
      <Rect width="320" height="180" fill="#0c0c0c" />
      <Ellipse cx="160" cy="172" rx="130" ry="5" fill={Colors.amber} opacity={0.06} />
      {/* rear wheel */}
      <Circle cx="55" cy="135" r="40" stroke={Colors.amber} strokeWidth="8" fill="none" />
      <Circle cx="55" cy="135" r="28" stroke="#1e1e1e" strokeWidth="1.5" fill="none" />
      <Circle cx="55" cy="135" r="7" fill={Colors.amber} opacity={0.85} />
      <Line x1="55" y1="95" x2="55" y2="175" stroke="#252525" strokeWidth="1.2" />
      <Line x1="15" y1="135" x2="95" y2="135" stroke="#252525" strokeWidth="1.2" />
      <Line x1="27" y1="107" x2="83" y2="163" stroke="#252525" strokeWidth="1.2" />
      <Line x1="83" y1="107" x2="27" y2="163" stroke="#252525" strokeWidth="1.2" />
      {/* front wheel */}
      <Circle cx="266" cy="139" r="32" stroke={Colors.amber} strokeWidth="7" fill="none" opacity={0.9} />
      <Circle cx="266" cy="139" r="22" stroke="#1e1e1e" strokeWidth="1.2" fill="none" />
      <Circle cx="266" cy="139" r="6" fill={Colors.amber} opacity={0.9} />
      <Line x1="266" y1="107" x2="266" y2="171" stroke="#252525" strokeWidth="1.2" />
      <Line x1="234" y1="139" x2="298" y2="139" stroke="#252525" strokeWidth="1.2" />
      {/* frame */}
      <Path d="M 82 135 L 96 100 L 104 93 L 170 88 L 200 82" stroke="#aaaaaa" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 104 93 L 102 135" stroke="#888888" strokeWidth="3.5" fill="none" />
      <Path d="M 170 88 L 165 114 L 160 135" stroke="#888888" strokeWidth="3.5" fill="none" />
      <Path d="M 200 82 L 216 96 L 234 116 L 250 135" stroke="#cccccc" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* engine */}
      <Rect x="126" y="108" width="42" height="32" rx="2" fill="#141414" stroke={Colors.amber} strokeWidth="1.2" />
      <Rect x="133" y="88" width="14" height="24" rx="2" fill="#1a1a1a" stroke="#333333" strokeWidth="0.8" />
      <Rect x="150" y="92" width="12" height="18" rx="2" fill="#181818" stroke="#2d2d2d" strokeWidth="0.8" />
      {/* tank */}
      <Path d="M 138 88 Q 152 78 178 82 L 200 82 L 198 90 L 174 91 L 145 92 Z" fill="#1a1a1a" stroke={Colors.amber} strokeWidth="1" />
      {/* seat */}
      <Path d="M 96 100 Q 108 92 124 90 L 142 88 L 140 95 L 120 97 L 104 103 Z" fill="#141414" stroke="#444444" strokeWidth="0.8" />
      {/* handlebars - ape if selected */}
      {hasApe ? (
        <>
          <Path d="M 200 82 L 193 58 L 178 48" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Path d="M 200 82 L 207 58 L 222 52" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path d="M 200 82 L 196 68 L 184 62" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Path d="M 200 82 L 204 68 L 216 65" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* headlight */}
      <Ellipse cx="234" cy="106" rx="10" ry="9" fill="#141414" stroke={Colors.amber} strokeWidth="1" />
      <Ellipse cx="234" cy="106" rx="5" ry="4" fill={Colors.amber} opacity={0.75} />
      {/* exhaust - drag or standard */}
      {hasDrags ? (
        <>
          <Path d="M 133 135 Q 108 142 82 140 Q 62 138 48 136" stroke="#888888" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Path d="M 138 139 Q 112 146 86 144 Q 65 142 50 140" stroke="#666666" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <Path d="M 133 135 Q 110 141 88 139 Q 68 137 54 135" stroke="#666666" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
    </Svg>
  );
}

export default function BuilderScreen() {
  const [step, setStep] = useState(0);
  const [selectedBike, setSelectedBike] = useState<Bike>(BIKES[0]);
  const [selectedStyle, setSelectedStyle] = useState(BUILD_STYLES[0].id);
  const [selectedMods, setSelectedMods] = useState<Set<string>>(new Set());
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const STEPS = ['Base Bike', 'Style', 'Mods', 'Preview'];

  const toggleMod = (mod: Mod) => {
    setSelectedMods(prev => {
      const next = new Set(prev);
      if (next.has(mod.id)) next.delete(mod.id);
      else next.add(mod.id);
      return next;
    });
  };

  const selectedModObjects = MODS.filter(m => selectedMods.has(m.id));
  const total = selectedModObjects.reduce((s, m) => s + m.price, 0);

  const handleGetAI = async () => {
    setLoading(true);
    try {
      const styleName = BUILD_STYLES.find(s => s.id === selectedStyle)?.label || selectedStyle;
      const result = await getBuildRecommendations(
        selectedBike.name,
        styleName,
        selectedModObjects.map(m => m.name)
      );
      setAiResult(result);
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the AI. Check your API key in src/theme.ts and your internet connection.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Custom Builder</Text>
        <View style={s.stepPips}>
          {STEPS.map((label, i) => (
            <View key={i} style={[s.pip, i < step ? s.pipDone : i === step ? s.pipActive : {}]} />
          ))}
        </View>
        <Text style={s.stepLabel}>{STEPS[step]}</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* STEP 0: Pick Bike */}
        {step === 0 && (
          <View style={s.stepWrap}>
            <Text style={s.stepTitle}>Pick Your Iron</Text>
            {BIKES.map(bike => (
              <TouchableOpacity
                key={bike.id}
                style={[s.bikeCard, selectedBike.id === bike.id && s.bikeCardSelected]}
                onPress={() => setSelectedBike(bike)}
                activeOpacity={0.7}
              >
                <View style={[s.radio, selectedBike.id === bike.id && s.radioSelected]}>
                  {selectedBike.id === bike.id && <View style={s.radioDot} />}
                </View>
                <View style={s.bikeInfo}>
                  <Text style={s.bikeName}>{bike.name}</Text>
                  <Text style={s.bikeSub}>{bike.year} · {bike.engine}</Text>
                </View>
                {bike.tag && <View style={s.bikeTag}><Text style={s.bikeTagText}>{bike.tag}</Text></View>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STEP 1: Style */}
        {step === 1 && (
          <View style={s.stepWrap}>
            <Text style={s.stepTitle}>Build Style</Text>
            <View style={s.styleGrid}>
              {BUILD_STYLES.map(st => (
                <TouchableOpacity
                  key={st.id}
                  style={[s.styleBtn, selectedStyle === st.id && s.styleBtnSelected]}
                  onPress={() => setSelectedStyle(st.id)}
                  activeOpacity={0.7}
                >
                  <Text style={s.styleIcon}>{st.icon}</Text>
                  <Text style={[s.styleLabel, selectedStyle === st.id && s.styleLabelSelected]}>{st.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: Mods */}
        {step === 2 && (
          <View style={s.stepWrap}>
            <Text style={s.stepTitle}>Select Mods</Text>
            {MODS.map(mod => (
              <TouchableOpacity
                key={mod.id}
                style={[s.modItem, selectedMods.has(mod.id) && s.modItemSelected]}
                onPress={() => toggleMod(mod)}
                activeOpacity={0.7}
              >
                <View style={[s.checkbox, selectedMods.has(mod.id) && s.checkboxSelected]}>
                  {selectedMods.has(mod.id) && <Text style={s.checkmark}>✓</Text>}
                </View>
                <View style={s.modInfo}>
                  <Text style={s.modName}>{mod.name}</Text>
                  <Text style={s.modDesc}>{mod.description}</Text>
                </View>
                <Text style={s.modPrice}>${mod.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
            <View style={s.costBar}>
              <View>
                <Text style={s.costLabel}>Estimated Total</Text>
                <Text style={s.costSub}>Parts + Labor</Text>
              </View>
              <Text style={s.costTotal}>${total.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* STEP 3: Preview */}
        {step === 3 && (
          <View style={s.stepWrap}>
            <Text style={s.stepTitle}>Your Build</Text>
            <View style={s.renderer}>
              <Text style={s.rendererLabel}>{selectedBike.name} — {BUILD_STYLES.find(st => st.id === selectedStyle)?.label}</Text>
              <BikeRenderer selectedMods={selectedModObjects} />
              <View style={s.renderTags}>
                {selectedModObjects.map(m => (
                  <View key={m.id} style={s.renderTag}>
                    <Text style={s.renderTagText}>{m.name}</Text>
                  </View>
                ))}
                {selectedModObjects.length === 0 && (
                  <Text style={s.noMods}>No mods selected — go back and add some!</Text>
                )}
              </View>
            </View>
            <View style={s.costBar}>
              <View>
                <Text style={s.costLabel}>Build Total</Text>
                <Text style={s.costSub}>{selectedModObjects.length} mods selected</Text>
              </View>
              <Text style={s.costTotal}>${total.toLocaleString()}</Text>
            </View>

            {!aiResult && (
              <TouchableOpacity style={s.aiBtn} onPress={handleGetAI} activeOpacity={0.8} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={Colors.bg} />
                ) : (
                  <Text style={s.aiBtnText}>Get AI Parts List & Vendor Recs ↗</Text>
                )}
              </TouchableOpacity>
            )}

            {aiResult && (
              <View style={s.aiResult}>
                <Text style={s.aiResultTag}>AI Build Plan</Text>
                <Text style={s.aiResultBody}>{aiResult.summary}</Text>

                {aiResult.partsList?.length > 0 && (
                  <>
                    <Text style={s.aiSubHead}>Parts List</Text>
                    {aiResult.partsList.map((p: any, i: number) => (
                      <View key={i} style={s.partsRow}>
                        <Text style={s.partName}>{p.part}</Text>
                        <View style={s.partsRight}>
                          <Text style={s.partVendor}>{p.vendor}</Text>
                          <Text style={s.partPrice}>{p.approxPrice}</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )}

                {aiResult.installOrder?.length > 0 && (
                  <>
                    <Text style={s.aiSubHead}>Install Order</Text>
                    {aiResult.installOrder.map((step: string, i: number) => (
                      <Text key={i} style={s.installStep}>{step}</Text>
                    ))}
                  </>
                )}

                {aiResult.tips?.length > 0 && (
                  <>
                    <Text style={s.aiSubHead}>Pro Tips</Text>
                    {aiResult.tips.map((tip: string, i: number) => (
                      <Text key={i} style={s.tip}>• {tip}</Text>
                    ))}
                  </>
                )}

                <View style={s.totalEstimate}>
                  <Text style={s.totalEstLabel}>Total Estimate</Text>
                  <Text style={s.totalEstVal}>{aiResult.totalEstimate}</Text>
                </View>
              </View>
            )}
            <View style={{ height: 20 }} />
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={s.actionBar}>
        {step > 0 && (
          <TouchableOpacity style={s.backBtn} onPress={() => setStep(s => s - 1)} activeOpacity={0.7}>
            <Text style={s.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity style={s.nextBtn} onPress={() => setStep(s => s + 1)} activeOpacity={0.8}>
            <Text style={s.nextBtnText}>{step === 2 ? 'Preview Build →' : 'Next →'}</Text>
          </TouchableOpacity>
        )}
        {step === 3 && (
          <TouchableOpacity style={s.nextBtn} onPress={() => { setStep(0); setSelectedMods(new Set()); setAiResult(null); }} activeOpacity={0.8}>
            <Text style={s.nextBtnText}>Start New Build</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg2 },
  headerTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 28, letterSpacing: 1, color: Colors.off, marginBottom: 8 },
  stepPips: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  pip: { width: 28, height: 3, borderRadius: 2, backgroundColor: Colors.border },
  pipDone: { backgroundColor: Colors.amber },
  pipActive: { backgroundColor: Colors.amberLight },
  stepLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 2.5, color: Colors.smoke, textTransform: 'uppercase' },
  scroll: { flex: 1 },
  stepWrap: { padding: 16, gap: 10 },
  stepTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 32, letterSpacing: 1, color: Colors.off, marginBottom: 4 },

  bikeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 14, borderRadius: 4 },
  bikeCardSelected: { borderColor: Colors.amber, backgroundColor: '#1a1200' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.amber, backgroundColor: Colors.amber },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.bg },
  bikeInfo: { flex: 1 },
  bikeName: { fontFamily: 'BarlowCondensed-Bold', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: Colors.off },
  bikeSub: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.smoke, marginTop: 1 },
  bikeTag: { backgroundColor: Colors.bg3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 2 },
  bikeTagText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 1.5, color: Colors.smoke },

  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleBtn: { width: '31%', backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 4, alignItems: 'center' },
  styleBtnSelected: { borderColor: Colors.amber, backgroundColor: '#1a1200' },
  styleIcon: { fontSize: 24, marginBottom: 6 },
  styleLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.chrome, textAlign: 'center' },
  styleLabelSelected: { color: Colors.amber },

  modItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 4 },
  modItemSelected: { borderColor: Colors.amber, backgroundColor: '#1a1200' },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: Colors.border2, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  checkmark: { color: Colors.bg, fontSize: 13, fontWeight: 'bold' },
  modInfo: { flex: 1 },
  modName: { fontFamily: 'BarlowCondensed-Bold', fontSize: 14, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.off },
  modDesc: { fontFamily: 'Barlow-Light', fontSize: 11, color: Colors.smoke, marginTop: 1 },
  modPrice: { fontFamily: 'BebasNeue-Regular', fontSize: 18, color: Colors.amberLight, letterSpacing: 0.5 },

  costBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, borderLeftColor: Colors.amber, padding: 14, borderRadius: 4 },
  costLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke },
  costSub: { fontFamily: 'Barlow-Light', fontSize: 11, color: Colors.muted, marginTop: 1 },
  costTotal: { fontFamily: 'BebasNeue-Regular', fontSize: 32, color: Colors.amber, letterSpacing: 1 },

  renderer: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, padding: 12 },
  rendererLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke, marginBottom: 8, textAlign: 'center' },
  renderTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, justifyContent: 'center' },
  renderTag: { backgroundColor: '#1a1200', borderWidth: 1, borderColor: Colors.amber, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  renderTagText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: Colors.amber },
  noMods: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.muted, textAlign: 'center', padding: 8 },

  aiBtn: { backgroundColor: Colors.amber, padding: 16, borderRadius: 3, alignItems: 'center' },
  aiBtnText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 16, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.bg },

  aiResult: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, borderLeftColor: Colors.amber, padding: 14, borderRadius: 4, gap: 6 },
  aiResultTag: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.amber },
  aiResultBody: { fontFamily: 'Barlow-Regular', fontSize: 14, color: Colors.chrome, lineHeight: 22 },
  aiSubHead: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke, marginTop: 8 },
  partsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  partName: { fontFamily: 'Barlow-Medium', fontSize: 13, color: Colors.off, flex: 1 },
  partsRight: { alignItems: 'flex-end' },
  partVendor: { fontFamily: 'Barlow-Light', fontSize: 11, color: Colors.smoke },
  partPrice: { fontFamily: 'BebasNeue-Regular', fontSize: 16, color: Colors.amberLight },
  installStep: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.chrome, lineHeight: 20, paddingVertical: 2 },
  tip: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.chrome, lineHeight: 20 },
  totalEstimate: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  totalEstLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke },
  totalEstVal: { fontFamily: 'BebasNeue-Regular', fontSize: 20, color: Colors.amber },

  actionBar: { flexDirection: 'row', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.bg2 },
  backBtn: { borderWidth: 1, borderColor: Colors.border2, padding: 14, borderRadius: 3, alignItems: 'center', minWidth: 80 },
  backBtnText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 15, letterSpacing: 1, color: Colors.off },
  nextBtn: { flex: 1, backgroundColor: Colors.amber, padding: 14, borderRadius: 3, alignItems: 'center' },
  nextBtnText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 16, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.bg },
});
