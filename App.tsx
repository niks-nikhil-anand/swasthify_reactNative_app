import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import "./global.css";

import { AuthProvider } from './src/context/AuthContext';

function App(): React.JSX.Element {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <AuthProvider>
            <NavigationContainer>
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
