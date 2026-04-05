import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Ellipse, Rect } from 'react-native-svg';
import { Colors } from '../src/theme';
import { GALLERY_BUILDS, type GalleryBuild } from '../src/data/bikes';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const FILTERS = ['All Builds', 'Choppers', 'Bobbers', 'Brat Style', 'Cafe Racer', 'Old School'];

function MiniBike({ accent = Colors.amber }: { accent?: string }) {
  return (
    <Svg width="100%" height={100} viewBox="0 0 200 100">
      <Rect width="200" height="100" fill="#0c0c0c" />
      <Circle cx="36" cy="68" r="24" stroke={accent} strokeWidth="5" fill="none" />
      <Circle cx="36" cy="68" r="15" stroke="#1e1e1e" strokeWidth="1" fill="none" />
      <Circle cx="36" cy="68" r="5" fill={accent} opacity={0.85} />
      <Line x1="36" y1="44" x2="36" y2="92" stroke="#252525" strokeWidth="1.2" />
      <Line x1="12" y1="68" x2="60" y2="68" stroke="#252525" strokeWidth="1.2" />
      <Circle cx="164" cy="70" r="19" stroke={accent} strokeWidth="4" fill="none" opacity={0.9} />
      <Circle cx="164" cy="70" r="12" stroke="#1e1e1e" strokeWidth="1" fill="none" />
      <Circle cx="164" cy="70" r="4" fill={accent} opacity={0.9} />
      <Path d="M 56 68 L 66 50 L 72 46 L 108 42 L 126 38" stroke="#aaaaaa" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 72 46 L 70 68" stroke="#888888" strokeWidth="2.5" fill="none" />
      <Path d="M 108 42 L 104 56 L 102 68" stroke="#888888" strokeWidth="2.5" fill="none" />
      <Path d="M 126 38 L 136 48 L 148 60 L 158 70" stroke="#cccccc" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Rect x="82" y="52" width="28" height="20" rx="2" fill="#141414" stroke={accent} strokeWidth="1" />
      <Rect x="87" y="38" width="10" height="17" rx="2" fill="#1a1a1a" stroke="#333333" strokeWidth="0.8" />
      <Path d="M 89 42 Q 100 37 108 39 L 126 38 L 125 45 L 107 47 L 92 50 Z" fill="#1a1a1a" stroke={accent} strokeWidth="0.8" />
      <Path d="M 126 38 L 122 26 L 114 22" stroke="#c0c0c0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M 126 38 L 130 26 L 138 23" stroke="#c0c0c0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M 84 68 Q 68 73 52 71 Q 40 69 32 67" stroke="#555555" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function BuildCard({ build }: { build: GalleryBuild }) {
  const [liked, setLiked] = useState(false);
  const accent = build.builder.includes('mex') ? Colors.rust : build.builder.includes('chrome') ? Colors.chrome : Colors.amber;
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.7}>
      <View style={s.cardImg}>
        <MiniBike accent={accent} />
      </View>
      <View style={s.cardBody}>
        <View style={s.cardTopRow}>
          <Text style={s.cardTitle}>{build.title}</Text>
          <Text style={s.cardPrice}>${(build.totalCost / 1000).toFixed(1)}k</Text>
        </View>
        <Text style={s.cardMeta}>{build.bike}</Text>
        <Text style={s.cardBuilder}>{build.builder}</Text>
        <View style={s.cardTags}>
          <View style={s.tag}><Text style={s.tagText}>{build.style}</Text></View>
          <View style={s.tag}><Text style={s.tagText}>{build.mods.length} mods</Text></View>
        </View>
        <TouchableOpacity style={s.likeRow} onPress={() => setLiked(l => !l)} activeOpacity={0.7}>
          <Text style={[s.likeHeart, liked && s.likeHeartActive]}>♥</Text>
          <Text style={s.likeCount}>{liked ? build.likes + 1 : build.likes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function FeaturedCard({ build }: { build: GalleryBuild }) {
  const [liked, setLiked] = useState(false);
  return (
    <TouchableOpacity style={s.featured} activeOpacity={0.8}>
      <View style={s.featuredImg}>
        <MiniBike accent={Colors.amber} />
        <View style={s.featuredLabel}><Text style={s.featuredLabelText}>FEATURED</Text></View>
      </View>
      <View style={s.featuredBody}>
        <View style={s.featuredTitleRow}>
          <Text style={s.featuredTitle}>{build.title}</Text>
          <Text style={s.featuredPrice}>${build.totalCost.toLocaleString()}</Text>
        </View>
        <Text style={s.featuredMeta}>{build.bike} · {build.style} · by {build.builder}</Text>
        <Text style={s.featuredLocation}>{build.location}</Text>
        <View style={s.featuredMods}>
          {build.mods.slice(0, 4).map(m => (
            <View key={m} style={s.featuredModTag}><Text style={s.featuredModText}>{m}</Text></View>
          ))}
          {build.mods.length > 4 && (
            <View style={s.featuredModTag}><Text style={s.featuredModText}>+{build.mods.length - 4} more</Text></View>
          )}
        </View>
        <TouchableOpacity style={s.likeRow} onPress={() => setLiked(l => !l)} activeOpacity={0.7}>
          <Text style={[s.likeHeart, liked && s.likeHeartActive]}>♥</Text>
          <Text style={s.likeCount}>{liked ? build.likes + 1 : build.likes} likes</Text>
          <Text style={s.commentCount}>· {Math.floor(build.likes / 20)} comments</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function GalleryScreen() {
  const [activeFilter, setActiveFilter] = useState('All Builds');
  const featured = GALLERY_BUILDS.find(b => b.featured)!;
  const rest = GALLERY_BUILDS.filter(b => !b.featured);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Community <Text style={s.headerAccent}>Gallery</Text></Text>
      </View>
      <ScrollView
        horizontal
        style={s.filterBar}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterPill, activeFilter === f && s.filterPillActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FeaturedCard build={featured} />
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>COMMUNITY BUILDS</Text>
          <Text style={s.sortLabel}>Sort: New ▾</Text>
        </View>
        <View style={s.grid}>
          {rest.map(b => <BuildCard key={b.id} build={b} />)}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg2 },
  headerTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 30, letterSpacing: 1, color: Colors.off },
  headerAccent: { color: Colors.amber },
  filterBar: { borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg2, maxHeight: 52 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row', alignItems: 'center' },
  filterPill: { paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  filterPillActive: { borderColor: Colors.amber, backgroundColor: '#1a1200' },
  filterText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: Colors.smoke },
  filterTextActive: { color: Colors.amber },
  featured: { margin: 14, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  featuredImg: { height: 160, position: 'relative' },
  featuredLabel: { position: 'absolute', top: 8, left: 10, backgroundColor: Colors.amber, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  featuredLabelText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 2, color: Colors.bg },
  featuredBody: { padding: 14, gap: 6 },
  featuredTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  featuredTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 26, letterSpacing: 1, color: Colors.off },
  featuredPrice: { fontFamily: 'BebasNeue-Regular', fontSize: 22, color: Colors.amber },
  featuredMeta: { fontFamily: 'Barlow-Light', fontSize: 13, color: Colors.smoke },
  featuredLocation: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.muted },
  featuredMods: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  featuredModTag: { backgroundColor: Colors.bg3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 2 },
  featuredModText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 10, letterSpacing: 0.5, color: Colors.smoke },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  likeHeart: { fontSize: 14, color: Colors.muted },
  likeHeartActive: { color: Colors.rust },
  likeCount: { fontFamily: 'BarlowCondensed-Bold', fontSize: 13, letterSpacing: 0.5, color: Colors.smoke },
  commentCount: { fontFamily: 'Barlow-Light', fontSize: 12, color: Colors.muted },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 8 },
  sectionTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 3, color: Colors.smoke },
  sortLabel: { fontFamily: 'BarlowCondensed-Bold', fontSize: 11, letterSpacing: 1, color: Colors.amber },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, gap: 10 },
  card: { width: CARD_W, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  cardImg: { height: 110 },
  cardBody: { padding: 10, gap: 3 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontFamily: 'BarlowCondensed-Bold', fontSize: 14, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.off, flex: 1 },
  cardPrice: { fontFamily: 'BebasNeue-Regular', fontSize: 16, color: Colors.amber },
  cardMeta: { fontFamily: 'Barlow-Light', fontSize: 11, color: Colors.smoke },
  cardBuilder: { fontFamily: 'Barlow-Light', fontSize: 11, color: Colors.muted },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tag: { backgroundColor: Colors.bg3, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 2 },
  tagText: { fontFamily: 'BarlowCondensed-Bold', fontSize: 9, letterSpacing: 0.5, color: Colors.muted },
});
