import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { UI } from '../components/UI'

const StyledView = styled(View);
const StyledText = styled(Text);

export default function HomeScreen() {
  return (
    <UI.View className="flex-1 items-center justify-center bg-white">
      <UI.Text className="text-xl font-bold text-blue-600">
        Pantalla Home operario
      </UI.Text>
    </UI.View>
  );
}
