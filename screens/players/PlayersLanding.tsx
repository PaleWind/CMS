import { Text, View } from 'react-native';
import { useAppDispatch } from '../../redux/hooks';

interface Props {
  navigation: any;
}
export function PlayersLanding({ navigation }: Props) {
  console.log('hi from players landing');
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text>Hi player</Text>
    </View>
  );
}
