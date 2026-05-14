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
import HealthPackagesScreen from '../screens/HealthPackagesScreen';
import OTPLoginScreen from '../screens/OTPLoginScreen';
import { RootDrawerParamList } from './types';
import { Image, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import Icon from '../components/Icon';
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
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? '#27272A' : '#F1F5F9',
                },
                headerTintColor: BRAND_GREEN,
                headerTitle: ({ children }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={{ width: 22, height: 22, marginRight: 8, tintColor: BRAND_GREEN }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '800',
                                letterSpacing: -0.3,
                                color: isDark ? '#F9FAFB' : '#0F172A',
                                fontFamily: 'Plus Jakarta Sans',
                            }}
                        >
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
                drawerInactiveTintColor: isDark ? '#94A3B8' : '#334155',
                drawerActiveBackgroundColor: isDark ? 'rgba(13, 169, 110, 0.12)' : '#E6F6EF',
                drawerStyle: {
                    backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                    width: 296,
                    borderTopRightRadius: 32,
                    borderBottomRightRadius: 32,
                },
                drawerItemStyle: {
                    borderRadius: 10,
                    marginHorizontal: 12,
                    marginVertical: 0,
                    paddingVertical: 0,
                },
                drawerLabelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                    marginLeft: -4,
                    marginVertical: 0,
                    fontFamily: 'Plus Jakarta Sans',
                    lineHeight: 20,
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={{
                            width: 40,
                            height: 40,
                            marginLeft: 4,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9',
                            borderWidth: 1,
                            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226, 232, 240, 0.5)',
                        }}
                    >
                        <Icon name="menu" size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                    >
                        <View style={{ alignItems: 'flex-end' }}>
                            {user && (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '700',
                                        color: isDark ? '#FFFFFF' : '#0F172A',
                                        fontFamily: 'Plus Jakarta Sans',
                                    }}
                                >
                                    {user.name.split(' ')[0]}
                                </Text>
                            )}
                        </View>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: isDark ? '#064E3B' : '#D1F2E2',
                                }}
                                onError={() => setImgError(true)}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 2,
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#0DA96E',
                                    borderWidth: 2,
                                    borderColor: isDark ? '#111827' : '#FFFFFF',
                                    borderRadius: 6,
                                }}
                            />
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

            {/* ===== Order matches screenshot exactly ===== */}

            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Home',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icon name="home" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'My Profile',
                    drawerIcon: ({ color }) => (
                        <Icon name="user" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Doctors"
                component={DoctorsScreen}
                options={{
                    title: 'Doctors',
                    drawerIcon: ({ color }) => (
                        <Icon name="doctor" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Labs"
                component={LabsScreen}
                options={{
                    title: 'Labs',
                    drawerIcon: ({ color }) => (
                        <Icon name="lab" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="HealthPackages"
                component={HealthPackagesScreen}
                options={{
                    title: 'Health packages',
                    drawerIcon: ({ color }) => (
                        <Icon name="pkg" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Appointments"
                component={AppointmentsScreen}
                options={{
                    title: 'Appointments',
                    drawerIcon: ({ color }) => (
                        <Icon name="appointments" color={color} size={18} />
                    ),
                    drawerLabel: ({ color, focused }) => (
                        <Text 
                            style={{ 
                                color, 
                                fontFamily: 'Plus Jakarta Sans', 
                                fontSize: 15, 
                                marginLeft: 8,
                                fontWeight: focused ? '800' : '600'
                            }}
                        >
                            Appointments
                        </Text>
                    ),
                }}
            />
            <Drawer.Screen
                name="HealthRecords"
                component={HealthRecordsScreen}
                options={{
                    title: 'Health records',
                    drawerIcon: ({ color }) => (
                        <Icon name="doc" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Pricing"
                component={PricingScreen}
                options={{
                    title: 'Pricing',
                    drawerIcon: ({ color }) => (
                        <Icon name="wallet" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Contact"
                component={ContactUsScreen}
                options={{
                    title: 'Contact',
                    drawerIcon: ({ color }) => (
                        <Icon name="mail" color={color} size={18} />
                    ),
                }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreen}
                options={{
                    title: 'About',
                    drawerIcon: ({ color }) => (
                        <Icon name="info" color={color} size={18} />
                    ),
                }}
            />

            {/* ===== Hidden screens (not in drawer) ===== */}

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
                name="OTPLogin"
                component={OTPLoginScreen}
                options={{
                    title: 'Login with OTP',
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
