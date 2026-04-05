import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';

const MY_BUILDS = [
  { name: 'Project Nightfall', bike: "'82 Sporty 883", style: 'Hardtail Chop', mods: 6, cost: 7240, status: 'In Progress' },
  { name: 'Widow Maker', bike: "'96 Dyna", style: 'Bobber', mods: 4, cost: 3890, status: 'Complete' },
  { name: 'Desert Rat', bike: "'03 Softail", style: 'Brat', mods: 5, cost: 5100, status: 'Planning' },
];

const STATUS_COLORS: Record<string, string> = {
  'In Progress': Colors.amber,
  'Complete': Colors.success,
  'Planning': Colors.smoke,
};

export default function GarageScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={s.profileHeader}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>JD</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>Jake Dillon</Text>
            <Text style={s.profileHandle}>@irondillo · El Paso, TX</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statNum}>3</Text>
            <Text style={s.statLabel}>Builds</Text>
          </View>
          <View style={[s.stat, s.statBorder]}>
            <Text style={s.statNum}>12</Text>
            <Text style={s.statLabel}>Diagnoses</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statNum}>$16k</Text>
            <Text style={s.statLabel}>Built</Text>
          </View>
        </View>

        {/* My Builds */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>MY BUILDS</Text>
          <TouchableOpacity><Text style={s.sectionLink}>+ New Build</Text></TouchableOpacity>
        </View>
        {MY_BUILDS.map(b => (
          <TouchableOpacity key={b.name} style={s.buildCard} activeOpacity={0.7}>
            <View style={s.buildCardTop}>
              <Text style={s.buildName}>{b.name}</Text>
              <Text style={s.buildCost}>${b.cost.toLocaleString()}</Text>
            </View>
            <Text style={s.buildMeta}>{b.bike} · {b.style} · {b.mods} mods</Text>
            <View style={s.buildStatusRow}>
              <View style={[s.statusDot, { backgroundColor: STATUS_COLORS[b.status] }]} />
              <Text style={[s.buildStatus, { color: STATUS_COLORS[b.status] }]}>{b.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Settings */}
        <View style={[s.sectionHeader, { marginTop: 12 }]}>
          <Text style={s.sectionTitle}>SETTINGS</Text>
        </View>
        <View style={s.settingsList}>
          {[
            { label: 'My Bikes', value: '3 bikes' },
            { label: 'Location', value: 'El Paso, TX' },
            { label: 'Currency', value: 'USD' },
            { label: 'Measurement', value: 'Imperial' },
            { label: 'Notifications', value: 'On' },
            { label: 'API Key', value: 'Configure' },
          ].map(setting => (
            <TouchableOpacity key={setting.label} style={s.settingRow} activeOpacity={0.7}>
              <Text style={s.settingLabel}>{setting.label}</Text>
              <View style={s.settingRight}>
                <Text style={s.settingValue}>{setting.value}</Text>
                <Text style={s.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={s.appInfo}>
          <Text style={s.appName}>IronWrench v1.0.0</Text>
          <Text style={s.appSub}>Built for iron souls · Powered by Claude AI</Text>
          <Text style={s.appSub2}>© 2026 IronWrench</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.amber, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'BebasNeue-Regular', fontSize: 22, color: Colors.bg, letterSpacing: 1 },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: 'BebasNeue-Regular', fontSize: 26, letterSpacing: 1, color: Colors.off },
  profileHandle: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke, marginTop: 1 },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statNum: { fontFamily: 'BebasNeue-Regular', fontSize: 28, color: Colors.amber, letterSpacing: 1 },
  statLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.smoke, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 3, color: Colors.smoke },
  sectionLink: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 1, color: Colors.amber },
  buildCard: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 4, gap: 5 },
  buildCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  buildName: { fontFamily: 'BarlowCondensed-Bold', fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', color: Colors.off },
  buildCost: { fontFamily: 'BebasNeue-Regular', fontSize: 20, color: Colors.amber },
  buildMeta: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.smoke },
  buildStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  buildStatus: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 1 },
  settingsList: { marginHorizontal: 16, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingLabel: { fontFamily: 'Barlow-Regular', fontSize: 14, color: Colors.chrome },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke },
  settingArrow: { fontFamily: 'Barlow-Regular', fontSize: 16, color: Colors.muted },
  appInfo: { alignItems: 'center', padding: 24, gap: 4 },
  appName: { fontFamily: 'BebasNeue-Regular', fontSize: 16, letterSpacing: 2, color: Colors.muted },
  appSub: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.muted },
  appSub2: { fontFamily: 'Barlow-Light', fontSize: 11, color: '#333333' },
});
