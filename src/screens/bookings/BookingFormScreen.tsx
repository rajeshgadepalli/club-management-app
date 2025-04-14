import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

const BookingFormScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDate(item)}
            style={{
              padding: 10,
              margin: 5,
              borderRadius: 5,
              backgroundColor: selectedDate.toDateString() === item.toDateString() ? '#1976d2' : '#f0f0f0',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedDate.toDateString() === item.toDateString() ? '#fff' : '#000' }}>
              {format(item, 'dd')}
            </Text>
            <Text style={{ fontSize: 14, color: selectedDate.toDateString() === item.toDateString() ? '#fff' : '#555' }}>
              {format(item, 'MMM')}
            </Text>
          </TouchableOpacity>
        )}
      />
      {/* Add more form elements below */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18 }}>Selected Date: {format(selectedDate, 'dd MMM yyyy')}</Text>
      </View>
    </View>
  );
};

export default BookingFormScreen;