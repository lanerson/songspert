import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

interface PillButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'default' | 'inverse';
  backgroundColor?: string;      
  color?: string;                
  borderColor?: string; 
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'default',
  backgroundColor: bgProp,
  color: colorProp,
  borderColor:borderProp,
  containerStyle,
  textStyle,
}) => {
  
  const defaultBg = variant === 'inverse' ? '#4B73E5' : '#E8F0FE';
  const defaultColor = variant === 'inverse' ? '#fff' : '#4B73E5';
  const defaultBorder = '#4B73E5';

  
  const backgroundColor = bgProp ?? defaultBg;
  const color = colorProp ?? defaultColor;
  const borderColor = borderProp ?? defaultBorder;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pillButton,
        { backgroundColor, borderColor: '#4B73E5' },
        containerStyle,
      ]}
    >
      <Text style={[styles.pillText, { color }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pillButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
  } as ViewStyle,
  pillText: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
});

export default PillButton;