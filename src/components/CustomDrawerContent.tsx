import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { navigation } = props;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../public/icons/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>Swastify</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.closeDrawer()}
                    >
                        <Text style={styles.iconText}>✕</Text>
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
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('SignIn')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.loginButtonText}>Log in</Text>
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
        paddingTop: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 36,
        height: 36,
        marginRight: 10,
    },
    logoText: {
        fontSize: 24,
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
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
        color: '#111827',
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
