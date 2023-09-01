import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Activity, ActivityType } from '../types/types';
import { routes } from './routes';
import { ManageActivityHome } from '../screens/direct/ManageActivityHome';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import ManageEventsScreen from '../screens/direct/ManageEventsScreen';
import { ActivitySettingsScreen } from '../screens/direct/ActivitySettingsScreen';
import { EventSettingsScreen } from '../screens/direct/EventSettingsScreen';
import { useAppSelector } from '../redux/hooks';
import { myActivityByIdSelector } from '../redux/slices/director/DirectorActivitiesSlice';
import { RootState } from '../redux/store';
import { shallowEqual } from 'react-redux';

const Drawer = createDrawerNavigator();

export const ActivityManagementDrawer = ({ route, navigation }: any) => {
  const {
    activityType,
    activityId,
  }: { activityType: ActivityType; activityId: number } = route?.params;
  const activity = useAppSelector(
    (state: RootState) =>
      myActivityByIdSelector(state, activityType, activityId),
    shallowEqual
  );
  if (!activity) {
    console.error('activityId is not available');
    return null;
  }

  const CustomDrawerContent = (props: any) => {
    const filteredProps = {
      ...props,
      state: {
        ...props.state,
        routeNames: props.state.routeNames.filter(
          // To hide single option
          // (routeName) => routeName !== 'HiddenPage1',
          // To hide multiple options you can add & condition
          (routeName: any) => {
            routeName !== routes.EVENT_SETTINGS;
          }
        ),
        routes: props.state.routes.filter(
          (route: any) => route.name !== routes.EVENT_SETTINGS
        ),
      },
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            padding: 20,
          }}
          onPress={() => props.navigation.navigate(routes.DIRECT_LANDING)}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <DrawerContentScrollView {...filteredProps}>
          <DrawerItemList {...filteredProps} />
        </DrawerContentScrollView>
      </SafeAreaView>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName={routes.MANAGE_ACTIVITY}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={routes.MANAGE_ACTIVITY}
        component={ManageActivityHome}
        initialParams={{ activityType, activityId: activity?.id }}
      />
      <Drawer.Screen
        name={routes.MANAGE_EVENTS}
        component={ManageEventsScreen}
        initialParams={{ activityType, activityId: activity?.id }}
      />
      {/* <Drawer.Screen
        name={routes.EVENT_SETTINGS}
        component={EventSettingsScreen}
        options={{ headerShown: true, headerTitle: 'Back' }}
      /> */}

      <Drawer.Screen
        name={routes.ACTIVITY_SETTINGS}
        component={ActivitySettingsScreen}
        initialParams={{ activityType, activityId: activity?.id }}
      />
    </Drawer.Navigator>
  );
};
