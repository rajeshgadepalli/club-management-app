import React, { useCallback, useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeliveryListScreen from '@/screens/deliveries/DeliveryListScreen';
import DeliveryScreen from '@/screens/deliveries/DeliveryScreen';

const Stack = createNativeStackNavigator();

function DeliveryListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <DeliveryListScreen {...props} />;
}

function DeliveryScreenWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <DeliveryScreen {...props} />;
}

export default function DeliveryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryList"
        component={DeliveryListWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Delivery"
        component={DeliveryScreenWrapper}
        options={{ title: 'Delivery Details', headerShown: true }}
      />
    </Stack.Navigator>
  );
}
