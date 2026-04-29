import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useColorScheme } from 'nativewind';
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
import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import SpecialitiesScreen from '../screens/SpecialitiesScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PackageDetailScreen from '../screens/PackageDetailScreen';
import OtpScreen from '../screens/OtpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { RootDrawerParamList } from './types';
import { Image, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BRAND_GREEN = '#0DA96E';

import { useAuth } from '../context/AuthContext';

const AppNavigator = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { user, isLoading, hasSeenOnboarding } = useAuth();
    const [imgError, setImgError] = React.useState(false);

    React.useEffect(() => {
        setImgError(false);
    }, [user?.profilePic]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={BRAND_GREEN} />
            </View>
        );
    }

    const getInitialRoute = (): keyof RootDrawerParamList => {
        if (user) return 'Home';
        if (!hasSeenOnboarding) return 'Onboarding';
        return 'SignIn';
    };

    return (
        <Drawer.Navigator
            key={`${user?.id || 'guest'}-${hasSeenOnboarding}`}
            initialRouteName={getInitialRoute()}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            backBehavior="history"
            screenOptions={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                    elevation: 0, // removed heavy manual shadows for a cleaner modern header
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? '#27272A' : '#F1F5F9', // subtle bottom border instead of shadow
                },
                headerTintColor: BRAND_GREEN,
                headerTitle: ({ children }) => (
                    <View className="flex-row items-center">
                        <Image 
                            source={require('../assets/logo.png')} 
                            style={{ width: 22, height: 22, marginRight: 8, tintColor: BRAND_GREEN }} 
                            resizeMode="contain"
                        />
                        <Text style={{ fontWeight: '800', fontSize: 17, letterSpacing: -0.3, color: isDark ? '#F9FAFB' : '#0F172A' }}>
                            {children}
                        </Text>
                    </View>
                ),
                headerLeftContainerStyle: {
                    paddingLeft: 12,
                },
                headerRightContainerStyle: {
                    paddingRight: 20,
                },
                drawerActiveTintColor: BRAND_GREEN,
                drawerInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
                drawerActiveBackgroundColor: isDark ? 'rgba(13, 169, 110, 0.15)' : '#E6F6EF',
                drawerStyle: {
                    backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                    width: '80%',
                    maxWidth: 320,
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24,
                },
                drawerItemStyle: {
                    borderRadius: 14,
                    marginHorizontal: 16,
                    paddingVertical: 2,
                    marginBottom: 6,
                },
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '700',
                    marginLeft: 4, // Added space between drawer icon and text
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-10 h-10 ml-1 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 active:bg-slate-200 dark:active:bg-slate-700"
                    >
                        <Feather name="menu" size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Profile');
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
                                source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                className="w-10 h-10 rounded-full border-2 border-[#D1F2E2] dark:border-[#064E3B]"
                                onError={() => setImgError(true)}
                            />
                            <View className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#0DA96E] border-2 border-white dark:border-[#111827] rounded-full" />
                        </View>
                    </TouchableOpacity>
                ),
            })}
        >
            {!hasSeenOnboarding && (
                <Drawer.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{
                        headerShown: false,
                        drawerItemStyle: { display: 'none' },
                    }}
                />
            )}
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
                name="HealthRecords"
                component={HealthRecordsScreen}
                options={{
                    title: 'Health Records',
                    drawerIcon: ({ color, size }) => (
                        <Feather name="folder" color={color} size={size} />
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
                name="Otp"
                component={OtpScreen}
                options={{
                    title: 'OTP Verification',
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    title: 'Forgot Password',
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
            <Drawer.Screen
                name="Specialities"
                component={SpecialitiesScreen}
                options={{
                    title: 'Our Specialities',
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="PackageDetail"
                component={PackageDetailScreen}
                options={{
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
};

export default AppNavigator;
