import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import { addToCart } from '../store/cartSlice';
import { FavoriteProduct, selectIsFavorite, toggleFavorite } from '../store/favoritesSlice';

const commentTranslations: Record<string, string> = {
    'Very unhappy with my purchase!': 'Muito insatisfeito com minha compra!',
    'Not as described!': 'Não é como descrito!',
    'Very satisfied!': 'Muito satisfeito!',
    'Excellent quality!': 'Excelente qualidade!',
    'Would not recommend!': 'Não recomendaria!',
    'Highly recommended!': 'Altamente recomendado!',
    'Very disappointed!': 'Muito decepcionado!',
    'Great value for money!': 'Ótimo custo-benefício!',
    'Poor quality!': 'Qualidade ruim!',
    'Fast shipping!': 'Entrega rápida!',
    'Waste of money!': 'Desperdício de dinheiro!',
    'Great product!': 'Ótimo produto!',
    'Terrible experience!': 'Experiência terrível!',
    'Awesome product!': 'Produto incrível!',
    'Disappointing purchase!': 'Compra decepcionante!',
    'Love it!': 'Amei!',
    'Would not buy again!': 'Não compraria de novo!',
    'Best purchase ever!': 'Melhor compra de todas!',
    'Not worth the price!': 'Não vale o preço!',
    'Received damaged!': 'Recebi danificado!',
    'Highly impressed!': 'Muito impressionado!',
    'Very pleased!': 'Muito satisfeito!',
    'Not up to expectations!': 'Abaixo das expectativas!',
    'beyond expectations!': 'Superou as expectativas!',
    'Would buy again!': 'Compraria de novo!',
    'Moderately satisfied!': 'Moderadamente satisfeito!',
    'Good but could be better!': 'Bom, mas poderia ser melhor!',
    'Just average!': 'Apenas mediano!',
    'Incredible value!': 'Valor incrível!',
    'Not happy with the purchase!': 'Não estou feliz com a compra!',
    'Very dissatisfied!': 'Muito insatisfeito!',
    'Absolutely wonderful!': 'Absolutamente maravilhoso!',
    'It works as expected!': 'Funciona como esperado!',
    'Broke after a week!': 'Quebrou depois de uma semana!',
};

const translateComment = (comment: string): string => {
    return commentTranslations[comment] || comment;
};

interface Review {
    rating: number;
    comment: string;
    reviewerName: string;
    date: string;
}

export default function DetailsScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const dispatch = useDispatch();
    const isFav = useSelector(selectIsFavorite(id));
    const scrollRef = useRef<ScrollView>(null);
    const { width: screenWidth } = useWindowDimensions();

    const sizes = ['P', 'M', 'G', 'GG'];

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                setLoading(true);
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProductDetails();
    }, [id]);

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            size: selectedSize,
        }));
        const msg = `${product.title} (Tamanho ${selectedSize}) adicionado à sacola! 🛍️`;
        if (Platform.OS === 'web') {
            window.alert(msg);
        }
        navigation.goBack();
    };

    const handleToggleFavorite = () => {
        if (!product) return;
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

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
                    size={14}
                    color="#FFD700"
                />
            );
        }
        return stars;
    };

    const getStatusColor = (status: string) => {
        if (status === 'In Stock') return '#00B894';
        if (status === 'Low Stock') return '#FDCB6E';
        return '#E63946';
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#111" />
            </View>
        );
    }

    if (!product) return null;

    const oldPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
    const images: string[] = product.images || [product.thumbnail];
    const imageWidth = Math.min(screenWidth, 800);
    const imageHeight = Platform.OS === 'web' ? imageWidth / 2 : imageWidth / 1.1;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.imageWrapper, { height: imageHeight }]}>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ flex: 1 }}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
                            setActiveImageIndex(index);
                        }}
                    >
                        {images.map((img: string, idx: number) => (
                            <View key={idx} style={[styles.imageSlide, { width: imageWidth, height: imageHeight }]}>
                                <Image source={{ uri: img }} style={styles.image} />
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.favOnImage} onPress={handleToggleFavorite}>
                        <Ionicons
                            name={isFav ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFav ? '#E63946' : '#333'}
                        />
                    </TouchableOpacity>

                    {images.length > 1 && (
                        <View style={styles.dotsRow}>
                            {images.map((_: string, idx: number) => (
                                <View
                                    key={idx}
                                    style={[styles.dot, activeImageIndex === idx && styles.dotActive]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.tagRow}>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>{product.rating}</Text>
                        </View>
                    </View>

                    <Text style={styles.brand}>{product.brand || 'Coleção Premium'}</Text>
                    <Text style={styles.title}>{product.title}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
                        <Text style={styles.oldPrice}>R$ {oldPrice}</Text>
                    </View>

                    <View style={styles.stockRow}>
                        <View style={[styles.stockDot, { backgroundColor: getStatusColor(product.availabilityStatus) }]} />
                        <Text style={[styles.stockText, { color: getStatusColor(product.availabilityStatus) }]}>
                            {product.availabilityStatus === 'In Stock' ? 'Em estoque' :
                                product.availabilityStatus === 'Low Stock' ? 'Últimas unidades' : 'Esgotado'}
                        </Text>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Tamanho</Text>
                    <View style={styles.sizesContainer}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.infoCardsRow}>
                        {product.warrantyInformation && (
                            <View style={styles.infoCard}>
                                <Ionicons name="shield-checkmark-outline" size={22} color="#6C5CE7" />
                                <Text style={styles.infoCardLabel}>Garantia</Text>
                                <Text style={styles.infoCardValue}>{product.warrantyInformation}</Text>
                            </View>
                        )}
                        {product.shippingInformation && (
                            <View style={styles.infoCard}>
                                <Ionicons name="car-outline" size={22} color="#00B894" />
                                <Text style={styles.infoCardLabel}>Entrega</Text>
                                <Text style={styles.infoCardValue}>{product.shippingInformation}</Text>
                            </View>
                        )}
                        {product.returnPolicy && (
                            <View style={styles.infoCard}>
                                <Ionicons name="refresh-outline" size={22} color="#E17055" />
                                <Text style={styles.infoCardLabel}>Devolução</Text>
                                <Text style={styles.infoCardValue}>{product.returnPolicy}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {product.reviews && product.reviews.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Avaliações ({product.reviews.length})</Text>
                            {product.reviews.map((review: Review, idx: number) => (
                                <View key={idx} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewAvatar}>
                                            <Text style={styles.reviewAvatarText}>
                                                {review.reviewerName.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                                            <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewComment}>{translateComment(review.comment)}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.buyButton} activeOpacity={0.9} onPress={handleAddToCart}>
                    <Ionicons name="bag-add-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.buyButtonText}>Adicionar à Sacola</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    },
    scrollContent: {
        flexGrow: 1,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%'
    },
    imageWrapper: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden',
    },
    imageSlide: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    favOnImage: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        zIndex: 2,
    },
    dotsRow: {
        position: 'absolute',
        bottom: 28,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DDD'
    },
    dotActive: {
        backgroundColor: '#111',
        width: 24
    },
    infoContainer: {
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 25,
        flex: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    tagRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    discountBadge: {
        backgroundColor: '#111',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    discountText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F5F7',
        paddingHorizontal: 12,
        borderRadius: 8
    },
    ratingText: {
        marginLeft: 6,
        fontWeight: '700',
        color: '#333'
    },
    brand: {
        fontSize: 13,
        color: '#888',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700'
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111',
        marginBottom: 15,
        lineHeight: 32
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center', gap: 12
    },
    price: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111'
    },
    oldPrice: {
        fontSize: 18,
        color: '#A0A0A0',
        textDecorationLine: 'line-through',
        fontWeight: '500'
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12
    },
    stockDot: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    stockText: {
        fontSize: 13,
        fontWeight: '700'
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 25
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    sizesContainer: {
        flexDirection: 'row',
        gap: 15
    },
    sizeButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    sizeButtonActive: { backgroundColor: '#111', borderColor: '#111' },
    sizeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555'
    },
    sizeTextActive: { color: '#fff' },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 26
    },
    infoCardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        flexWrap: 'wrap'
    },
    infoCard: {
        flex: 1,
        minWidth: 100,
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        gap: 6,
    },
    infoCardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase'
    },
    infoCardValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center'
    },
    reviewCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 12
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewAvatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800'
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4
    },
    reviewStars: { flexDirection: 'row', gap: 2 },
    reviewComment: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 25,
        paddingVertical: Platform.OS === 'ios' ? 30 : 20,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center',
    },
    buyButton: {
        flexDirection: 'row',
        backgroundColor: '#111',
        width: Platform.OS === 'web' ? 400 : '100%',
        maxWidth: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
});