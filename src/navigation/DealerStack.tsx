import React, { useCallback, useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DealerListScreen from '@/screens/dealers/DealerListScreen';
import DealerFormScreen from '@/screens/dealers/DealerFormScreen';
import AadhaarVerification from '@/screens/dealers/AadhaarVerification';
import { AadhaarData } from '@/types/aadhaar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type DealerStackParamList = {
  DealerList: undefined;
  AadhaarVerification: undefined;
  DealerForm: {
    id?: string;
    address?: AadhaarData;
  };
};

const Stack = createNativeStackNavigator<DealerStackParamList>();

function DealerListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <DealerListScreen {...props} />;
}

function DealerFormWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <DealerFormScreen {...props} />;
}

function AadhaarVerificationWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <AadhaarVerification {...props} />;
}

export default function DealerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DealerList"
        component={DealerListWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AadhaarVerification"
        component={AadhaarVerificationWrapper}
        options={{ title: 'Verify Aadhaar', headerShown: true }}
      />
      <Stack.Screen
        name="DealerForm"
        component={DealerFormWrapper}
        options={({ route }: NativeStackScreenProps<DealerStackParamList, 'DealerForm'>) => ({
          title: route.params?.id ? 'Edit Dealer' : 'Add Dealer',
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
