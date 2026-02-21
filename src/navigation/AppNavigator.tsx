import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import PricingScreen from '../screens/PricingScreen';
import FAQScreen from '../screens/FAQScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import LabsScreen from '../screens/LabsScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import { RootDrawerParamList } from './types';
import { Image, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BRAND_GREEN = '#0DA96E';

import { useAuth } from '../context/AuthContext';

const AppNavigator = () => {
    const isDark = false;
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={BRAND_GREEN} />
            </View>
        );
    }

    return (
        <Drawer.Navigator
            initialRouteName={user ? "Home" : "SignIn"}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                },
                headerTintColor: BRAND_GREEN,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    color: isDark ? '#F9FAFB' : '#111827',
                },
                headerLeftContainerStyle: {
                    paddingLeft: 20,
                },
                headerRightContainerStyle: {
                    paddingRight: 20,
                },
                drawerActiveTintColor: BRAND_GREEN,
                drawerInactiveTintColor: isDark ? '#9CA3AF' : '#4B5563',
                drawerActiveBackgroundColor: isDark ? '#064E3B' : '#D1F2E2',
                drawerStyle: {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    width: 300,
                },
                drawerItemStyle: {
                    borderRadius: 12,
                    marginHorizontal: 12,
                    paddingVertical: 4,
                    marginBottom: 2,
                },
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '600',
                    marginLeft: -10,
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Profile icon pressed');
                        }}
                        className="flex-row items-center gap-x-3"
                    >
                        <View className="items-end">
                            {user && (
                                <Text className="text-sm font-bold text-[#111827] dark:text-white leading-tight">
                                    {user.name.split(' ')[0]}
                                </Text>
                            )}
                        </View>
                        <View className="relative">
                            <Image
                                source={require('../assets/user_avatar.png')}
                                className="w-10 h-10 rounded-full border-2 border-[#D1F2E2] dark:border-[#064E3B]"
                            />
                            <View className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-brand-green border-2 border-white dark:border-slate-900 rounded-full" />
                        </View>
                    </TouchableOpacity>
                ),
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="home" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'My Profile',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="user" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Doctors"
                component={DoctorsScreen}
                options={{
                    title: 'Doctors',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="user-plus" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Labs"
                component={LabsScreen}
                options={{
                    title: 'Labs',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="activity" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Appointments"
                component={AppointmentsScreen}
                options={{
                    title: 'Appointments',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="calendar" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Pricing"
                component={PricingScreen}
                options={{
                    title: 'Pricing',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="dollar-sign" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreen}
                options={{
                    title: 'About',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="info" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Contact"
                component={ContactUsScreen}
                options={{
                    title: 'Contact',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="mail" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="FAQ"
                component={FAQScreen}
                options={{ title: 'FAQ', drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                    title: 'Sign In',
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Sign Up',
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="CampaignDetail"
                component={CampaignDetailScreen}
                options={{
                    title: 'Service Details',
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
};

export default AppNavigator;
