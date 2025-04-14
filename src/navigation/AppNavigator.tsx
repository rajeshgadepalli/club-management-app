import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/api/useAuth";
import LogoutButton from "@/components/common/LogoutButton";

import LoginScreen from "@/screens/auth/LoginScreen";
import Dashboard from "@/screens/Dashboard";
import DealerStack from "./DealerStack";
import SalesStack from "./SalesStack";
import UnplannedActivityStack from "./UnplannedActivityStack";
import DeliveryStack from "./DeliveryStack";
import PaymentStack from "./PaymentStack";

import ExpenseStack from "./ExpenseStack";
import SalesReturnStack from "./SalesReturnStack";
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, clearAuth } = useAuthContext();
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = logout.subscribe(async () => {
      await clearAuth();
    });
    return () => unsubscribe();
  }, []);

  const AppDrawer = () => (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: "#f0f0f0",
        drawerActiveTintColor: "#1976d2",
        headerRight: () => <LogoutButton />,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Dealers"
        component={DealerStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sales Orders"
        component={SalesStack}
        options={{
          title: "Sales Orders",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Deliveries"
        component={DeliveryStack}
        options={{
          title: "Deliveries",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="truck-delivery"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={PaymentStack}
        options={{
          title: "Payments",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="cash-multiple"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Unplanned Activities"
        component={UnplannedActivityStack}
        options={{
          title: "Unplanned Activities",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Expenses"
        component={ExpenseStack}
        options={{
          title: "Expenses",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="credit-card-minus"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sales Returns"
        component={SalesReturnStack}
        options={{
          title: "Sales Returns",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons
              name="backup-restore"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            children={(props) => (
              <LoginScreen {...props} onLogin={() => true} />
            )}
          />
        ) : (
          <Stack.Screen
            name="AppDrawer"
            component={AppDrawer}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
