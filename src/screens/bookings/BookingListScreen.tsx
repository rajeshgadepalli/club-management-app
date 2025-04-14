import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '@/utils/dateUtils';
import { Booking } from '@/types/booking';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import mockData from '@/mockData/bookings';
import { FAB, Modal, Portal, Card } from 'react-native-paper';
import CourtAvailabilityScreen from './CourtAvailabilityScreen';

const BookingListScreen = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const sports = [
        { name: 'Snooker', image: require('@/assets/images/snooker.png') },
        { name: 'Badminton', image: require('@/assets/images/badminton.png') },
        { name: 'Table Tennis', image: require('@/assets/images/table-tennis.png') },
        { name: 'Lawn Tennis', image: require('@/assets/images/lawn-tennis.png') },
    ];

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const navigateToCourtAvailability = () => {
        hideModal();
        navigation.navigate('CourtAvailability');
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch future bookings from mock data
                const response = mockData.bookings;
                setBookings(response.filter((booking) => booking.date > new Date()));
            } catch (err) {
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Future Bookings</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bookingItem}>
                        <Text style={styles.date}>{formatDate(item.date)}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.timeSlot}>{item.timeSlot}</Text>
                        <Text style={styles.court}>{item.court}</Text>
                    </View>
                )}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={showModal}
            />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                    {/* <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select a Sport to Book</Text>
                    </View> */}
                    {sports.map((sport) => (
                        <Card key={sport.name} style={styles.card} onPress={navigateToCourtAvailability}>
                            <Card.Cover source={sport.image} style={{ height: 120, resizeMode: 'cover' }} />
                            <Card.Title title={sport.name} titleStyle={styles.cardTitle} />
                        </Card>
                    ))}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bookingItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    timeSlot: {
        fontSize: 14,
        color: '#888',
    },
    court: {
        fontSize: 14,
        color: '#444',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        // padding: 20,
        margin: 20,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow cards to wrap into rows
        justifyContent: 'space-evenly', // Distribute cards evenly
    },
    modalHeader: {
        marginBottom: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        margin: 10,
        width: '40%', // Adjust width to fit two cards per row with spacing
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardImage: {
        height: 100, // Reduce image height
        width: '100%', // Ensure image fits the card width
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BookingListScreen;