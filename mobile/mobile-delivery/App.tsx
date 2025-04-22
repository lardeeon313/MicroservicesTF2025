import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function App() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-gray-100">
      <StyledText className="text-3xl font-bold text-blue-600">
        ¡NativeWind funcionando!
      </StyledText>
    </StyledView>
  );
}
