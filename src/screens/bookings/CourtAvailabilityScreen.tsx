import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Install this if not already
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

const mockCourtData = Array.from({ length: 4 }, (_, i) => ({
    court: `Court #${i + 1}`,
    slots: generateHourlySlots(),
}));

const CourtAvailabilityScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCourt, setSelectedCourt] = useState(mockCourtData[0].court);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const toggleSlotSelection = (slotTime: string) => {
        setSelectedSlots((prevSelectedSlots) => {
            if (prevSelectedSlots.includes(slotTime)) {
                return prevSelectedSlots.filter((time) => time !== slotTime);
            } else {
                return [...prevSelectedSlots, slotTime];
            }
        });
    };

    const selectedCourtData = mockCourtData.find(c => c.court === selectedCourt);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }} // Add padding to prevent content from going behind the button
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    {/* Date Picker */}
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dateListContainer} // Ensure proper styling for the FlatList
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
                                <Text style={[
                                    styles.dateText,
                                    selectedDate.toDateString() === item.toDateString() && styles.selectedDateTextWhite
                                ]}>
                                    {format(item, 'dd')}
                                </Text>
                                <Text style={[
                                    styles.monthText,
                                    selectedDate.toDateString() === item.toDateString() && styles.selectedDateTextWhite
                                ]}>
                                    {format(item, 'MMM')}
                                </Text>

                            </TouchableOpacity>
                        )}
                    />

                    {/* Selected Date Display */}
                    <Text style={styles.selectedDateText}>
                        Selected Date: {format(selectedDate, 'dd MMM yyyy')}
                    </Text>

                    {/* Court Dropdown */}
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Select Court:</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={selectedCourt}
                                onValueChange={(value) => setSelectedCourt(value)}
                            >
                                {mockCourtData.map(court => (
                                    <Picker.Item label={court.court} value={court.court} key={court.court} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Slots for Selected Court */}
                    <View style={styles.courtContainer}>
                        <Text style={styles.courtTitle}>{selectedCourt}</Text>
                        <View style={styles.slotsContainer}>
                            {selectedCourtData?.slots.map((slot, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.slot,
                                        slot.booked
                                            ? styles.bookedSlot
                                            : selectedSlots.includes(slot.time)
                                                ? styles.selectedSlot
                                                : styles.availableSlot,
                                    ]}
                                    disabled={slot.booked}
                                    onPress={() => toggleSlotSelection(slot.time)}
                                >
                                    <Text
                                        style={
                                            slot.booked
                                                ? styles.bookedSlotText
                                                : selectedSlots.includes(slot.time)
                                                    ? styles.selectedSlotText
                                                    : styles.availableSlotText
                                        }
                                    >
                                        {slot.time.split(' - ')[0]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.bookButton} onPress={() => console.log('Booking slots:', selectedSlots)}>
                <Text style={styles.bookButtonText}>CONFIRM BOOKING</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    courtContainer: {
        marginTop: 20,
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
        justifyContent: 'space-between',
    },
    slot: {
        paddingVertical: 10,
        margin: 5,
        borderRadius: 12,          // <- Soft rounded pill shape
        width: '20%',
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    availableSlot: {
        backgroundColor: '#FFFFFF',
        borderColor: '#4CAF50',       // Soft green
        borderWidth: 1
    },
    bookedSlot: {
        backgroundColor: '#ECECEC',   // Light grey
        borderColor: '#CCC',
        borderWidth: 1,
    },
    selectedSlot: {
        backgroundColor: colors.primary,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    slotText: {
        fontWeight: '600',
    },
    availableSlotText: {
        color: '#666', // dark green
        fontWeight: '600',
    },
    bookedSlotText: {
        color: '#999999', // light gray
        fontWeight: '400',
    },
    selectedSlotText: {
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
        backgroundColor: colors.primary
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
    selectedDateTextWhite: {
        color: '#FFFFFF',
    },
    pickerContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: colors.textPrimary,
    },
    picker: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: 5,
        paddingHorizontal: 10, // Add padding to ensure content is not touching the border
        height: 50, // Set a fixed height for consistent appearance
    },
    dateListContainer: {
        paddingVertical: 10,
        backgroundColor: colors.surface,
    },
    bookButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primary,
        padding: 15,
        alignItems: 'center',
    },
    bookButtonText: {
        color: colors.surface,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CourtAvailabilityScreen;
