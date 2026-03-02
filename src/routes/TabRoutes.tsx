import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ProductList from '../components/ProductList';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { selectCartCount } from '../store/cartSlice';

const Tab = createBottomTabNavigator();

// Telas de catálogo separadas por categoria (requisito do trabalho)
const MasculinoScreen = () => (
    <ProductList categories={['mens-shirts', 'mens-shoes', 'mens-watches']} />
);

const FemininoScreen = () => (
    <ProductList categories={['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches']} />
);

export default function TabRoutes() {
    const cartCount = useSelector(selectCartCount);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#fff',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F0F0',
                },
                headerTitleStyle: { fontWeight: '700', fontSize: 20, color: '#111' },
                tabBarActiveTintColor: '#111',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 8,
                    backgroundColor: '#fff',
                    borderTopColor: '#F0F0F0',
                    borderTopWidth: 1,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: -4 },
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    if (route.name === 'Masculino') {
                        iconName = focused ? 'man' : 'man-outline';
                    } else if (route.name === 'Feminino') {
                        iconName = focused ? 'woman' : 'woman-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Sacola') {
                        iconName = focused ? 'bag-handle' : 'bag-handle-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return (
                        <View>
                            <Ionicons name={iconName} size={size} color={color} />
                            {route.name === 'Sacola' && cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                },
            })}
        >
            {/* Abas obrigatórias do trabalho: Masculino e Feminino */}
            <Tab.Screen
                name="Masculino"
                component={MasculinoScreen}
                options={{ title: 'Masculino' }}
            />
            <Tab.Screen
                name="Feminino"
                component={FemininoScreen}
                options={{ title: 'Feminino' }}
            />
            {/* Abas extras para funcionalidades adicionais */}
            <Tab.Screen
                name="Favoritos"
                component={FavoritesScreen}
                options={{ title: 'Favoritos' }}
            />
            <Tab.Screen
                name="Sacola"
                component={CartScreen}
                options={{ title: 'Minha Sacola' }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{ title: 'Meu Perfil' }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: '#E63946',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
});