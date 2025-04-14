import React, { useCallback, useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SalesOrderListScreen from '@/screens/sales/SalesOrderListScreen';
import SalesOrderFormScreen from '@/screens/sales/SalesOrderFormScreen';
import SalesOrderViewScreen from '@/screens/sales/SalesOrderViewScreen';

const Stack = createNativeStackNavigator();

function SalesOrderListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <SalesOrderListScreen {...props} />;
}

function SalesOrderFormWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <SalesOrderFormScreen {...props} />;
}

function SalesOrderViewWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <SalesOrderViewScreen {...props} />;
}

export default function SalesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SalesOrderList"
        component={SalesOrderListWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SalesOrderForm"
        component={SalesOrderFormWrapper}
        options={{ title: 'Sales Order', headerShown: true }}
      />
      <Stack.Screen
        name="ViewSalesOrder"
        component={SalesOrderViewWrapper}
        options={{ title: 'View Sales Order', headerShown: true }}
      />
    </Stack.Navigator>
  );
}
