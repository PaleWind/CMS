import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import icons from '../../theme/icons';
import { footerStyles } from '../../theme/styles/footer';

export const ActivityFooter = (viewFlyer: any) => {
  return (
    <View style={footerStyles.container}>
      <TouchableOpacity style={footerStyles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode="contain"
          style={footerStyles.likeBtnImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={footerStyles.actionBtn}
        onPress={() => viewFlyer()}
      >
        <Text style={footerStyles.actionBtnText}>View flyer</Text>
      </TouchableOpacity>
    </View>
  );
};
