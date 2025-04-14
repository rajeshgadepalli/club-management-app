import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import colors from '@/theme/colors';

// Generate hourly slots between 6AM and 11PM
const generateHourlySlots = () => {
  const slots = [];
  const startHour = 6;
  const endHour = 23;

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({ time: `${startTime} - ${endTime}`, booked: Math.random() > 0.5 });
  }

  return slots;
};

const mockCourtData = [
  {
    court: 'Court #1',
    slots: generateHourlySlots(),
  },
  {
    court: 'Court #2',
    slots: generateHourlySlots(),
  },
  {
    court: 'Court #3',
    slots: generateHourlySlots(),
  },
  {
    court: 'Court #4',
    slots: generateHourlySlots(),
  },
];

const CourtAvailabilityScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDate(item)}
            style={[
              styles.dateItem,
              selectedDate.toDateString() === item.toDateString() && styles.selectedDateItem,
            ]}
          >
            <Text style={styles.dateText}>{format(item, 'dd')}</Text>
            <Text style={styles.monthText}>{format(item, 'MMM')}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.selectedDateText}>Selected Date: {format(selectedDate, 'dd MMM yyyy')}</Text>
      <FlatList
        data={mockCourtData}
        keyExtractor={(item) => item.court}
        renderItem={({ item }) => (
          <View style={styles.courtContainer}>
            <Text style={styles.courtTitle}>{item.court}</Text>
            <View style={styles.slotsContainer}>
              {item.slots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slot,
                    slot.booked ? styles.bookedSlot : styles.availableSlot,
                  ]}
                  disabled={slot.booked}
                >
                  <Text style={styles.slotText}>{slot.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  courtContainer: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    shadowColor: colors.divider,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  courtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slot: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  bookedSlot: {
    backgroundColor: colors.warning,
  },
  availableSlot: {
    backgroundColor: colors.success,
  },
  slotText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  dateItem: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: colors.surface,
    alignItems: 'center',
    shadowColor: colors.divider,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  monthText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: colors.textPrimary,
  },
});

export default CourtAvailabilityScreen;