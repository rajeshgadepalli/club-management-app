import React, { useCallback, useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ExpenseFormScreen from "@/screens/expense/ExpenseFormScreen";
import ExpenseListScreen from "@/screens/expense/ExpenseListScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ExpenseStackParamList = {
  ExpenseList: undefined;
  ExpenseForm: {
    id?: string;
  };
};

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

function ExpenseListWrapper(props: any) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerShown: true });
    }, [navigation])
  );
  return <ExpenseListScreen {...props} />;
}

function ExpenseFormWrapper(props: any) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerShown: false });
  }, [navigation]);
  return <ExpenseFormScreen {...props} />;
}

export default function ExpenseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormWrapper}
        options={({
          route,
        }: NativeStackScreenProps<ExpenseStackParamList, "ExpenseForm">) => ({
          title: route.params?.id ? "Edit Expense" : "Add Expense",
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
