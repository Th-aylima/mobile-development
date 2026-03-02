import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavorites, toggleFavorite } from '../store/favoritesSlice';

export default function FavoritesScreen() {
    const favorites = useSelector(selectFavorites);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const { width } = useWindowDimensions();
    const numColumns = width > 1200 ? 5 : width > 900 ? 4 : width > 600 ? 3 : 2;

    if (favorites.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                    <Ionicons name="heart-outline" size={64} color="#E63946" />
                </View>
                <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
                <Text style={styles.emptySubtitle}>Toque no ♡ dos produtos que você ama para salvá-los aqui!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                key={numColumns}
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('Details', { id: item.id })}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.thumbnail }} style={styles.image} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>-{Math.round(item.discountPercentage)}%</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => dispatch(toggleFavorite(item))}
                            >
                                <Ionicons name="heart" size={20} color="#E63946" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                            {item.rating && (
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={12} color="#FFD700" />
                                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                                </View>
                            )}
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                                <Text style={styles.oldPrice}>
                                    R$ {(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F5F7',
        padding: 40
    },
    emptyIconWrap: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF0F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111',
        marginBottom: 8
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22
    },
    list: {
        padding: 10,
        paddingBottom: 30
    },
    row: {
        justifyContent: 'flex-start',
        gap: 15,
        marginBottom: 15
    },
    card: {
        flex: 1,
        minWidth: 150,
        maxWidth: Platform.OS === 'web' ? 300 : ('100%' as any),
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4
        },
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        position: 'relative',
        padding: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 1,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800'
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        zIndex: 1,
    },
    info: {
        padding: 15,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 14,
        color: '#444',
        marginBottom: 6,
        fontWeight: '500',
        height: 40
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#555'
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        flexWrap: 'wrap'
    },
    price: {
        fontSize: 18,
        color: '#111',
        fontWeight: '800'
    },
    oldPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through'
    },
});
