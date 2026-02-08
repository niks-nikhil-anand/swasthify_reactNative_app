import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    Header,
} from 'react-native/Libraries/NewAppScreen';
import "./global.css";

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle} className="flex-1">
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}
                    className="p-10 items-center justify-center"
                >
                    <Text className="text-2xl font-bold text-center text-blue-500">
                        Welcome to SwastifyApp
                    </Text>
                    <Text className="text-lg text-center mt-4 dark:text-gray-300">
                        Android build setup in progress...
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default App;
