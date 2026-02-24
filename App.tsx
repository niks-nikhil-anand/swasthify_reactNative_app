import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import "./global.css";

import { AuthProvider } from './src/context/AuthContext';

const DarkTheme = {
    ...NavigationDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        background: '#020817',
        card: '#111827',
        text: '#F9FAFB',
        border: '#1F2937',
    },
};

function App(): React.JSX.Element {
    const [showSplash, setShowSplash] = useState(true);
    const { colorScheme } = useColorScheme();

    return (
        <AuthProvider>
            <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                {showSplash ? (
                    <SplashScreen onFinish={() => setShowSplash(false)} />
                ) : (
                    <AppNavigator />
                )}
            </NavigationContainer>
        </AuthProvider>
    );
}

export default App;
