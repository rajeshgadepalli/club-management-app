import React, { useCallback, useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UnplannedActivityListScreen from "@/screens/UnplannedActivities/UnplannedActivityListScreen";
import UnplannedActivityFormScreen from "@/screens/UnplannedActivities/UnplannedActivityFormScreen";

export type UnplannedActivityStackParamList = {
  UnplannedActivityList: undefined;
  UnplannedActivityForm: {
    id?: number;
  };
};

const Stack = createNativeStackNavigator<UnplannedActivityStackParamList>();

function UnplannedActivityListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <UnplannedActivityListScreen {...props} />;
}

function UnplannedActivityFormWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <UnplannedActivityFormScreen {...props} />;
}

export default function UnplannedActivityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UnplannedActivityList"
        component={UnplannedActivityListWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnplannedActivityForm"
        component={UnplannedActivityFormWrapper}
        options={({
          route,
        }: NativeStackScreenProps<
          UnplannedActivityStackParamList,
          "UnplannedActivityForm"
        >) => ({
          title: route.params?.id
            ? "Edit Unplanned Activity"
            : "Add Unplanned Activity",
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
