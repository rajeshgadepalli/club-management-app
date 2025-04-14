import React, { useCallback, useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SalesReturnListScreen from "@/screens/salesReturns/SalesReturnListScreen";
import SalesReturnFormScreen from "@/screens/salesReturns/SalesReturnFormScreen";
import SalesReturnViewScreen from "@/screens/salesReturns/SalesReturnViewScreen";

export type SalesReturnStackParamList = {
  SalesReturnList: undefined;
  SalesReturnForm: { id?: number };
  SalesReturnViewScreen: { id: number };
};

const Stack = createNativeStackNavigator<SalesReturnStackParamList>();

function SalesReturnListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <SalesReturnListScreen {...props} />;
}

function SalesReturnFormWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <SalesReturnFormScreen {...props} />;
}

function SalesReturnViewWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <SalesReturnViewScreen {...props} />;
}

export default function SalesReturnStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SalesReturnList"
        component={SalesReturnListWrapper}
        options={{ title: "Sales Returns", headerShown: false }}
      />
      <Stack.Screen
        name="SalesReturnForm"
        component={SalesReturnFormWrapper}
        options={({ route }) => ({
          title: route.params?.id ? "Edit Sales Return" : "Add Sales Return",
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="SalesReturnViewScreen"
        component={SalesReturnViewWrapper}
        options={{
          title: "Sales Return Details",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
