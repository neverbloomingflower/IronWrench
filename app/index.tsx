import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, Path, Ellipse, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../src/theme';

const { width } = Dimensions.get('window');

function MotoBanner() {
  return (
    <Svg width="100%" height={160} viewBox="0 0 340 160">
      <Rect width="340" height="160" fill={Colors.bg2} />
      <SvgText x="170" y="100" textAnchor="middle" fill="#161616" fontSize="80" fontFamily="sans-serif" fontWeight="bold">CHOP</SvgText>
      {/* rear wheel */}
      <Circle cx="58" cy="118" r="38" stroke={Colors.amber} strokeWidth="7" fill="none" />
      <Circle cx="58" cy="118" r="26" stroke="#1e1e1e" strokeWidth="1.5" fill="none" />
      <Circle cx="58" cy="118" r="7" fill={Colors.amber} opacity={0.85} />
      <Line x1="58" y1="80" x2="58" y2="156" stroke="#252525" strokeWidth="1.2" />
      <Line x1="20" y1="118" x2="96" y2="118" stroke="#252525" strokeWidth="1.2" />
      <Line x1="31" y1="91" x2="85" y2="145" stroke="#252525" strokeWidth="1.2" />
      <Line x1="85" y1="91" x2="31" y2="145" stroke="#252525" strokeWidth="1.2" />
      {/* front wheel */}
      <Circle cx="278" cy="122" r="30" stroke={Colors.amber} strokeWidth="6" fill="none" opacity={0.9} />
      <Circle cx="278" cy="122" r="20" stroke="#1e1e1e" strokeWidth="1.2" fill="none" />
      <Circle cx="278" cy="122" r="6" fill={Colors.amber} opacity={0.85} />
      <Line x1="278" y1="92" x2="278" y2="152" stroke="#252525" strokeWidth="1.2" />
      <Line x1="248" y1="122" x2="308" y2="122" stroke="#252525" strokeWidth="1.2" />
      {/* frame */}
      <Path d="M 88 118 L 106 80 L 116 74 L 182 70 L 212 64" stroke="#aaaaaa" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 116 74 L 113 118" stroke="#888888" strokeWidth="3.5" fill="none" />
      <Path d="M 182 70 L 176 96 L 172 118" stroke="#888888" strokeWidth="3.5" fill="none" />
      <Path d="M 212 64 L 228 78 L 244 98 L 258 118" stroke="#cccccc" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* engine */}
      <Rect x="138" y="88" width="40" height="32" rx="2" fill="#141414" stroke={Colors.amber} strokeWidth="1.2" />
      <Rect x="145" y="66" width="13" height="24" rx="2" fill="#1a1a1a" stroke="#333333" strokeWidth="0.8" />
      <Rect x="161" y="72" width="12" height="18" rx="2" fill="#181818" stroke="#2a2a2a" strokeWidth="0.8" />
      {/* tank */}
      <Path d="M 150 70 Q 164 60 188 63 L 212 64 L 210 72 L 186 73 L 155 74 Z" fill="#1a1a1a" stroke={Colors.amber} strokeWidth="1" />
      {/* seat */}
      <Path d="M 106 80 Q 118 72 135 70 L 153 68 L 151 75 L 131 77 L 114 83 Z" fill="#141414" stroke="#444444" strokeWidth="0.8" />
      {/* bars */}
      <Path d="M 212 64 L 207 47 L 196 40" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Path d="M 212 64 L 217 47 L 229 43" stroke="#c0c0c0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* headlight */}
      <Ellipse cx="242" cy="90" rx="9" ry="8" fill="#141414" stroke={Colors.amber} strokeWidth="1" />
      <Ellipse cx="242" cy="90" rx="5" ry="4" fill={Colors.amber} opacity={0.7} />
      {/* exhaust */}
      <Path d="M 145 118 Q 122 124 98 122 Q 78 120 62 118" stroke="#666666" strokeWidth="4" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

const QUICK_ACTIONS = [
  { label: 'New Build', sub: 'Design & price a custom chop', route: '/builder', icon: '🔩' },
  { label: 'Diagnose', sub: 'AI engine diagnostic', route: '/diagnostic', icon: '🔊' },
  { label: 'Gallery', sub: 'Community builds', route: '/gallery', icon: '📸' },
  { label: 'My Garage', sub: 'Saved builds & profile', route: '/garage', icon: '🏠' },
];

const RECENT = [
  { name: 'Project Nightfall', meta: "'82 Sporty · Hardtail Chop · 6 mods", price: '$7,240', color: Colors.amber },
  { name: 'Widow Maker', meta: "'96 Dyna · Bobber · 4 mods", price: '$3,890', color: Colors.chrome },
  { name: 'Desert Rat', meta: "'03 Softail · Brat · 5 mods", price: '$5,100', color: Colors.rust },
];

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topbar}>
        <Text style={s.logo}>Iron<Text style={s.logoAccent}>Wrench</Text></Text>
        <View style={s.badge}><Text style={s.badgeText}>BETA</Text></View>
      </View>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.heroWrap}>
          <Text style={s.eyebrow}>Your Iron. Your Rules.</Text>
          <Text style={s.heroTitle}>Build. <Text style={s.heroAccent}>Diagnose.</Text> Ride.</Text>
          <Text style={s.heroSub}>Design your dream chop, get real costs, diagnose issues — all in your pocket.</Text>
          <MotoBanner />
        </View>
        <View style={s.grid}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity key={a.label} style={s.qaCard} onPress={() => router.push(a.route as any)} activeOpacity={0.7}>
              <Text style={s.qaIcon}>{a.icon}</Text>
              <Text style={s.qaTitle}>{a.label}</Text>
              <Text style={s.qaSub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>RECENT BUILDS</Text>
          <Text style={s.sectionLink}>See all</Text>
        </View>
        {RECENT.map(b => (
          <TouchableOpacity key={b.name} style={s.buildRow} activeOpacity={0.7} onPress={() => router.push('/garage' as any)}>
            <View style={[s.buildDot, { backgroundColor: b.color }]} />
            <View style={s.buildInfo}>
              <Text style={s.buildName}>{b.name}</Text>
              <Text style={s.buildMeta}>{b.meta}</Text>
            </View>
            <Text style={s.buildPrice}>{b.price}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: 'rgba(10,10,10,0.98)' },
  logo: { fontFamily: 'BebasNeue-Regular', fontSize: 26, letterSpacing: 1.5, color: Colors.off },
  logoAccent: { color: Colors.amber },
  badge: { backgroundColor: Colors.amber, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  badgeText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 1.5, color: Colors.bg },
  scroll: { flex: 1 },
  heroWrap: { backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 16, paddingBottom: 0 },
  eyebrow: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 3, color: Colors.amber, marginBottom: 6, textTransform: 'uppercase' },
  heroTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 42, lineHeight: 42, letterSpacing: 1, color: Colors.off, marginBottom: 8 },
  heroAccent: { color: Colors.amber },
  heroSub: { fontFamily: 'Barlow-Light', fontSize: 14, color: Colors.smoke, lineHeight: 22, marginBottom: 12, maxWidth: 300 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 8 },
  qaCard: { width: (width - 36) / 2, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 14, borderRadius: 4 },
  qaIcon: { fontSize: 22, marginBottom: 6 },
  qaTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: Colors.off, marginBottom: 2 },
  qaSub: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.smoke },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  sectionTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 3, color: Colors.smoke },
  sectionLink: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 1.5, color: Colors.amber },
  buildRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, padding: 12, marginHorizontal: 16, marginBottom: 8, borderRadius: 4 },
  buildDot: { width: 8, height: 8, borderRadius: 4 },
  buildInfo: { flex: 1 },
  buildName: { fontFamily: 'BarlowCondensed-Bold', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: Colors.off },
  buildMeta: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.smoke, marginTop: 1 },
  buildPrice: { fontFamily: 'BebasNeue-Regular', fontSize: 20, color: Colors.amber, letterSpacing: 1 },
});
