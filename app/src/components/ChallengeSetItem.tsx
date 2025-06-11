import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface ChallengeSet {
  id: string;
  name: string;
}

interface Props {
  item: ChallengeSet;
  onPress: () => void;
}

export default function ChallengeSetItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color="#4B73E5" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  } as ViewStyle,
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
});