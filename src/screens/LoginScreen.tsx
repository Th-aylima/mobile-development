import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        if (email === '' || password === '') {
            if (Platform.OS === 'web') {
                window.alert('Por favor, preencha todos os campos.');
            } else {
                Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            }
            return;
        }

        dispatch(loginUser(email));
        navigation.replace('Tabs');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Ionicons name="bag-handle" size={80} color="#111" />
                    <Text style={styles.title}>Loja da Thay</Text>
                    <Text style={styles.subtitle}>A moda no seu ritmo.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Seu melhor e-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Acessar Catálogo</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center'
    },
    logoContainer: {
        alignItems: 'center'
        , marginBottom: 50
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#111',
        marginTop: 15,
        letterSpacing: -1
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        paddingHorizontal: 15,
        height: 60,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    inputIcon: { marginRight: 10 },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333'
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#111',
        height: 60,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: '#111',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 10
    }
});