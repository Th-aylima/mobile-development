import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectCartCount } from '../store/cartSlice';
import { selectFavorites } from '../store/favoritesSlice';
import { logoutUser } from '../store/userSlice';

export default function ProfileScreen() {
    const email = useSelector((state: RootState) => state.user.email);
    const cartCount = useSelector(selectCartCount);
    const favorites = useSelector(selectFavorites);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigation.replace('Login');
    };

    const initials = email
        ? email.substring(0, 2).toUpperCase()
        : 'TS';

    const menuItems = [
        { icon: 'bag-handle-outline', label: 'Meus Pedidos', info: '0 pedidos', color: '#6C5CE7' },
        { icon: 'heart-outline', label: 'Favoritos', info: `${favorites.length} itens`, color: '#E63946' },
        { icon: 'cart-outline', label: 'Minha Sacola', info: `${cartCount} itens`, color: '#00B894' },
        { icon: 'location-outline', label: 'Endereços', info: 'Gerenciar', color: '#FDCB6E' },
        { icon: 'card-outline', label: 'Pagamento', info: 'Gerenciar', color: '#0984E3' },
        { icon: 'notifications-outline', label: 'Notificações', info: 'Ativadas', color: '#E17055' },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.email}>{email || 'usuario@email.com'}</Text>
                <Text style={styles.memberLabel}>Membro Loja da Thay</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{favorites.length}</Text>
                    <Text style={styles.statLabel}>Favoritos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{cartCount}</Text>
                    <Text style={styles.statLabel}>Na Sacola</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Pedidos</Text>
                </View>
            </View>

            <View style={styles.menuCard}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
                        <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                            <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <View style={styles.menuTextWrap}>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuInfo}>{item.info}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.aboutRow} activeOpacity={0.7}>
                <Ionicons name="information-circle-outline" size={22} color="#888" />
                <Text style={styles.aboutText}>Sobre o App</Text>
                <Text style={styles.versionText}>v1.0.0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={22} color="#E63946" />
                <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    },
    content: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        padding: 20
    },
    profileCard: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111'
    },
    email: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 4
    },
    memberLabel: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500'
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center'
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111',
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888'
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#F0F0F0'
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F8F8',
    },
    menuIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextWrap: {
        flex: 1,
        marginLeft: 14
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333'
    },
    menuInfo: {
        fontSize: 12,
        color: '#999'
        , marginTop: 2
    },
    aboutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        gap: 12,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
    },
    aboutText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#555'
    },
    versionText: {
        fontSize: 13,
        color: '#BBB',
        fontWeight: '500'
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0F1',
        borderRadius: 16,
        padding: 18,
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E63946'
    },
});

