import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { avatarNames, avatarImages, AvatarName } from '../../assets/images/avatar';

export interface AvatarSelectorProps {
  selectedAvatar: AvatarName | null;
  onSelectAvatar: (avatar: AvatarName) => void;
  placeholderSize?: number;
  iconSize?: number;
}

export default function AvatarSelector({
  selectedAvatar,
  onSelectAvatar,
  placeholderSize = 100,
  iconSize = 50,
}: AvatarSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.avatarSelector, 
        { width: placeholderSize, height: placeholderSize, borderRadius: placeholderSize / 2 }]}
        onPress={() => setModalVisible(true)}
      >
        {selectedAvatar ? (
          <Image
            source={avatarImages[selectedAvatar]}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={iconSize} color="#666" />
          </View>
        )}
      </TouchableOpacity>
      

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Avatar</Text>
            <View style={styles.avatarsGrid}>
              {avatarNames.map((name) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => {
                    onSelectAvatar(name as AvatarName);
                    setModalVisible(false);
                  }}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === name && styles.avatarSelected,
                  ]}
                >
                  <Image
                    source={avatarImages[name as AvatarName]}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarSelector: {
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 26,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: 77,
    height: 77,
    margin: 6,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#4B73E5',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4B73E5',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
