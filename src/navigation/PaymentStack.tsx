import React, { useCallback, useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PaymentListScreen from '@/screens/payments/PaymentListScreen';
import PaymentFormScreen from '@/screens/payments/PaymentFormScreen';
import PaymentViewScreen from '@/screens/payments/PaymentViewScreen';

const Stack = createNativeStackNavigator();

function PaymentListWrapper(props: any) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );

  return <PaymentListScreen {...props} />;
}

function PaymentFormWrapper(props: any) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // Hide drawer header when in form screen
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);

  return <PaymentFormScreen {...props} />;
}

function PaymentViewWrapper(props: any) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // Hide drawer header when viewing a payment
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);

  return <PaymentViewScreen {...props} />;
}

export default function PaymentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentList"
        component={PaymentListWrapper}
        options={{ headerShown: false }} // Stack header hidden
      />
      <Stack.Screen
        name="PaymentForm"
        component={PaymentFormWrapper}
        options={{ title: 'Add Payment', headerShown: true }}
      />
      <Stack.Screen
        name="ViewPayment"
        component={PaymentViewWrapper}
        options={{ title: 'Payment Details', headerShown: true }}
      />
    </Stack.Navigator>
  );
}
