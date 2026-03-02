import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';

import TabRoutes from './src/routes/TabRoutes';
import DetailsScreen from './src/screens/DetailsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Tabs"
                        component={TabRoutes}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Details"
                        component={DetailsScreen}
                        options={{
                            title: 'Detalhes do Produto',
                            headerStyle: {
                                backgroundColor: '#fff',
                            },
                            headerTitleStyle: { fontWeight: '700', fontSize: 18, color: '#111' },
                            headerTintColor: '#111',
                            headerShadowVisible: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}