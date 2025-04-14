import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingListScreen from '@/screens/bookings/BookingListScreen';
import BookingFormScreen from '@/screens/bookings/BookingFormScreen';

export type BookingStackParamList = {
    BookingList: undefined;
    BookingForm: { id?: string };
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BookingList"
                component={BookingListScreen}
                options={{ title: 'Bookings', headerShown: true }}
            />
            <Stack.Screen
                name="BookingForm"
                component={BookingFormScreen}
                options={({ route }) => ({
                    title: route.params?.id ? 'Edit Booking' : 'Add Booking',
                    headerShown: true,
                })}
            />
        </Stack.Navigator>
    );
}