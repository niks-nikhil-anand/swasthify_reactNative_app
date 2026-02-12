import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { navigation } = props;

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.container}
        >
            {/* ── Branded Header ── */}
            <View style={styles.header}>
                <Text style={styles.logoEmoji}>🩺</Text>
                <Text style={styles.logoText}>Swasthify</Text>
                <Text style={styles.tagline}>Your Health Companion</Text>
            </View>

            {/* ── Navigation Items ── */}
            <View style={styles.navSection}>
                <DrawerItemList {...props} />
            </View>

            {/* ── Auth Section ── */}
            <View style={styles.authSection}>
                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={() => navigation.navigate('SignIn')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate('SignUp')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.signUpLinkText}>
                        Don't have an account?{' '}
                        <Text style={styles.signUpBold}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const BRAND_GREEN = '#0DA96E';
const ACCENT_GREEN = '#00C68A';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // ── Header ──
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(209,213,219,0.4)', // border/40
    },
    logoEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    logoText: {
        fontSize: 26,
        fontWeight: '800',
        color: BRAND_GREEN,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 13,
        color: '#6B7280', // muted-foreground
        marginTop: 4,
    },
    // ── Nav items ──
    navSection: {
        flex: 1,
        paddingTop: 8,
    },
    // ── Auth footer ──
    authSection: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(209,213,219,0.4)',
        marginBottom: 20,
    },
    signInButton: {
        backgroundColor: BRAND_GREEN,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    signInText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    signUpLink: {
        alignItems: 'center',
        marginTop: 16,
    },
    signUpLinkText: {
        color: '#6B7280',
        fontSize: 14,
    },
    signUpBold: {
        color: BRAND_GREEN,
        fontWeight: '700',
    },
});

export default CustomDrawerContent;
