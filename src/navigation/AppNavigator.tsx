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
import { useColorScheme } from 'nativewind';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BRAND_GREEN = '#0DA96E';

const AppNavigator = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Drawer.Navigator
            initialRouteName="SignIn"
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
                headerRightContainerStyle: {
                    paddingRight: 20,
                },
                drawerActiveTintColor: BRAND_GREEN,
                drawerInactiveTintColor: isDark ? '#9CA3AF' : '#4B5563',
                drawerActiveBackgroundColor: isDark ? '#064E3B' : '#D1F2E2',
                drawerStyle: {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                },
                drawerItemStyle: {
                    borderRadius: 8,
                    marginHorizontal: 12,
                    paddingVertical: 2,
                    marginBottom: 4,
                },
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: -2,
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to profile or open menu in future
                            console.log('Profile icon pressed');
                        }}
                    >
                        <Image
                            source={require('../assets/user_avatar.png')}
                            className="w-10 h-10 rounded-full border border-gray-200"
                        />
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
        </Drawer.Navigator>
    );
};

export default AppNavigator;
