import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import { FavoriteProduct, selectFavorites, toggleFavorite } from '../store/favoritesSlice';

interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
    rating: number;
}

interface ProductListProps {
    categories: string[];
}

type FilterType = 'all' | 'best' | 'new' | 'promo';

export default function ProductList({ categories }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searching, setSearching] = useState(false);
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const favorites = useSelector(selectFavorites);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { width } = useWindowDimensions();
    const numColumns = width > 1200 ? 5 : width > 900 ? 4 : width > 600 ? 3 : 2;

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const requests = categories.map(category =>
                    api.get(`/products/category/${category}`)
                );
                const responses = await Promise.all(requests);
                let allProducts: Product[] = [];
                responses.forEach(response => {
                    allProducts = [...allProducts, ...response.data.products];
                });
                const shuffled = allProducts.sort(() => Math.random() - 0.5);
                setProducts(shuffled);
                setFilteredProducts(shuffled);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [categories]);

    const handleSearch = useCallback((text: string) => {
        setSearchQuery(text);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (text.trim() === '') {
            setSearching(false);
            applyFilter(activeFilter, products);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                setSearching(true);
                const response = await api.get(`/products/search?q=${encodeURIComponent(text)}`);
                const results = response.data.products as Product[];
                const categorySet = new Set(categories);
                const filtered = results.filter((p: any) => categorySet.has(p.category));
                setFilteredProducts(filtered.length > 0 ? filtered : results);
            } catch (error) {
                console.error("Erro na busca:", error);
            } finally {
                setSearching(false);
            }
        }, 400);
    }, [products, activeFilter, categories]);

    const applyFilter = useCallback((filter: FilterType, baseProducts: Product[]) => {
        setActiveFilter(filter);
        let result = [...baseProducts];

        switch (filter) {
            case 'best':
                result = result.sort((a, b) => b.rating - a.rating);
                break;
            case 'new':
                result = result.sort((a, b) => b.id - a.id);
                break;
            case 'promo':
                result = result.filter(p => p.discountPercentage >= 10);
                break;
            default:
                break;
        }
        setFilteredProducts(result);
    }, []);

    const handleFilterPress = (filter: FilterType) => {
        setSearchQuery('');
        applyFilter(filter, products);
    };

    const isFavorited = (id: number) => favorites.some(f => f.id === id);

    const handleToggleFavorite = (product: Product) => {
        const favProduct: FavoriteProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
        };
        dispatch(toggleFavorite(favProduct));
    };

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'Tudo' },
        { key: 'best', label: 'Mais Vendidos' },
        { key: 'new', label: 'Lançamentos' },
        { key: 'promo', label: 'Promoções' },
    ];

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#111" />
                <Text style={styles.loadingText}>Atualizando coleções...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput as any}
                        placeholder="Buscar produtos..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searching && <ActivityIndicator size="small" color="#888" style={{ marginLeft: 8 }} />}
                    {searchQuery !== '' && !searching && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#CCC" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.pillsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
                        {filters.map(f => (
                            <TouchableOpacity
                                key={f.key}
                                style={[styles.pill, activeFilter === f.key && styles.pillActive]}
                                onPress={() => handleFilterPress(f.key)}
                            >
                                <Text style={[styles.pillText, activeFilter === f.key && styles.pillTextActive]}>
                                    {f.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {filteredProducts.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={48} color="#CCC" />
                    <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
                    <Text style={styles.emptySubtext}>Tente buscar por outro termo</Text>
                </View>
            ) : (
                <FlatList
                    key={numColumns}
                    data={filteredProducts}
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
                                    onPress={() => handleToggleFavorite(item)}
                                >
                                    <Ionicons
                                        name={isFavorited(item.id) ? 'heart' : 'heart-outline'}
                                        size={20}
                                        color={isFavorited(item.id) ? '#E63946' : '#333'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={12} color="#FFD700" />
                                    <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '—'}</Text>
                                </View>
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
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F5F7'
    },
    loadingText: {
        marginTop: 12,
        color: '#555',
        fontWeight: '600'
    },
    header: {
        backgroundColor: '#fff',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F5F7',
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
    },
    searchIcon: { marginRight: 10 },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        ...Platform.select({ web: { outlineStyle: 'none' } })
    },
    pillsContainer: { marginTop: 15 },
    pillsScroll: {
        paddingHorizontal: 15,
        gap: 10
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F4F5F7',
        borderWidth: 1,
        borderColor: '#EAEAEA'
    },
    pillActive: { backgroundColor: '#111', borderColor: '#111' },
    pillText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14
    },
    pillTextActive: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#555',
        marginTop: 16
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 6
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
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#F0F0F0'
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
    }
});