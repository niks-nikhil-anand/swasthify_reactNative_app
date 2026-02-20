import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '../context/AuthContext';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { navigation } = props;
    const { user, logout } = useAuth();

    const handleAuthAction = async () => {
        if (user) {
            await logout();
            navigation.navigate('SignIn');
        } else {
            navigation.navigate('SignIn');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-card">
            <View style={styles.header}>
                {user ? (
                    <View style={styles.profileContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={require('../assets/user_avatar.png')}
                                style={styles.profileImage}
                            />
                            <View style={styles.onlineIndicator} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text numberOfLines={1} style={styles.profileName}>{user.name}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>Swastify</Text>
                    </View>
                )}

                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.closeDrawer()}
                        className="bg-muted"
                    >
                        <Feather
                            name="x"
                            size={20}
                            color="#4B5563"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.navSection}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={styles.footer}>
                {/* Contact Card */}
                <View style={styles.contactCard}>
                    <View style={styles.contactBadge}>
                        <Text style={styles.contactBadgeText}>NEED HELP?</Text>
                    </View>
                    <Text style={styles.contactTitle}>Support Details</Text>

                    <View style={styles.contactItem}>
                        <Text style={styles.contactIcon}>✉️</Text>
                        <Text style={styles.contactText}>support@swasthify.com</Text>
                    </View>

                    <View style={styles.contactItem}>
                        <Text style={styles.contactIcon}>📞</Text>
                        <Text style={styles.contactText}>+91 97592 25515</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, user && { borderColor: '#EF4444' }]}
                    onPress={handleAuthAction}
                    activeOpacity={0.8}
                    className="bg-card border-border"
                >
                    <Text style={[styles.loginButtonText, user && { color: '#EF4444' }]}>
                        {user ? 'Log out' : 'Log in'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const BRAND_GREEN = '#0DA96E';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: BRAND_GREEN,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        backgroundColor: '#10B981',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    profileRole: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
        color: BRAND_GREEN,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    iconText: {
        fontSize: 18,
        color: '#374151', // gray-700
    },
    scrollContainer: {
        paddingTop: 0,
    },
    navSection: {
        paddingTop: 10,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 10,
    },
    loginButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    loginButtonText: {
        color: BRAND_GREEN,
        fontWeight: '600',
        fontSize: 16,
    },
    contactCard: {
        backgroundColor: '#E7FAF2', // Light brand green
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D1F2E2',
    },
    contactBadge: {
        backgroundColor: BRAND_GREEN,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    contactBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    contactText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
    },
});

export default CustomDrawerContent;
