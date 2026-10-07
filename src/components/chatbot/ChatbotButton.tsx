import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

type ChatbotButtonProps = {
    onPress: () => void;
};

export function ChatbotButton({ onPress }: ChatbotButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Open Swasthify Assistant"
            onPress={onPress}
            style={styles.button}
        >
            <MessageCircle size={27} color="#FFFFFF" strokeWidth={2.4} />
            <View style={styles.badge}>
                <Text style={styles.badgeText}>AI</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        bottom: 28,
        zIndex: 50,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0DA96E',
        shadowColor: '#0DA96E',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 12,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 24,
        height: 24,
        paddingHorizontal: 4,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    badgeText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 10,
        fontWeight: '900',
        color: '#0DA96E',
    },
});
