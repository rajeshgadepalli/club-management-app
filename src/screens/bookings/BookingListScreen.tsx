import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '@/utils/dateUtils';
import { Booking } from '@/types/booking';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import mockData from '@/mockData/bookings';
import { FAB, Modal, Portal, Card } from 'react-native-paper';

const BookingListScreen = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const sports = [
        { name: 'Snooker', image: { uri: 'https://plus.unsplash.com/premium_photo-1667117794358-a59991cc4d7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Badminton', image: { uri: 'https://images.unsplash.com/photo-1708312604109-16c0be9326cd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Table Tennis', image: { uri: 'https://images.unsplash.com/photo-1682369368407-9ca29b7a96a3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Lawn Tennis', image: { uri: 'https://images.unsplash.com/photo-1682369368407-9ca29b7a96a3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    ];

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

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
                    {sports.map((sport) => (
                        <Card key={sport.name} style={styles.card} onPress={() => {
                            hideModal();
                            navigation.navigate('BookingForm', { sport: sport.name });
                        }}>
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