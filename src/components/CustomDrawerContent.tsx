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
                    <Text style={styles.logoText}>Swasthify</Text>
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
});

export default CustomDrawerContent;
