import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import PricingScreen from '../screens/PricingScreen';
import FAQScreen from '../screens/FAQScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { RootDrawerParamList } from './types';
import { Image, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BRAND_GREEN = '#0DA96E';

const AppNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#FFFFFF',
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
                    color: '#111827', // foreground
                },
                drawerActiveTintColor: '#0DA96E',
                drawerInactiveTintColor: '#4B5563', // gray-600
                drawerActiveBackgroundColor: '#D1F2E2', // light green
                drawerItemStyle: {
                    borderRadius: 8,
                    marginHorizontal: 12,
                    paddingVertical: 2,
                    marginBottom: 4,
                },
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: -16,
                },
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
                name="Doctors"
                component={PlaceholderScreen}
                options={{
                    title: 'Doctors',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="user-plus" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Labs"
                component={PlaceholderScreen}
                options={{
                    title: 'Labs',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="activity" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="LabTests"
                component={PlaceholderScreen}
                options={{
                    title: 'Lab Tests',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="file-text" color={color} size={size} />
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
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Sign Up',
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
};

export default AppNavigator;
