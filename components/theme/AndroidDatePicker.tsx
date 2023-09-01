// import React from 'react'
// import { Text, View } from 'react-native';
// import { styles } from '../../theme/styles/styles';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const AndroidDatePicker = ({date}: {date:Date}) => {
//   return (
//     <View style={styles.row}>
//         <Text style={styles.label}>Start date:</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <Text style={styles.dateText}>{date?.toLocaleDateString()}</Text>
//           <Icon
//             name="calendar"
//             size={30}
//             color="#000"
//             onPress={() => setShowDatePicker(true)}
//           />
//         </View>
//       </View>
//       {showDatePicker && (
//         <DateTimePicker
//           value={startDate}
//           mode="date"
//           display="default"
//           onChange={(_, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               setStartDate(selectedDate);
//             }
//           }}
//         />
//       )}
//   )
// }

// export default AndroidDatePicker
