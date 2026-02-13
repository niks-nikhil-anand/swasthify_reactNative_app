import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BRAND_GREEN = '#0DA96E';

const AppNavigator = () => {
    return (
        <NavigationContainer>
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
                    drawerActiveTintColor: BRAND_GREEN,
                    drawerInactiveTintColor: '#4B5563', // gray-600
                    drawerActiveBackgroundColor: 'rgba(13,169,110,0.06)', // primary/6
                    drawerItemStyle: {
                        borderRadius: 12,
                        marginHorizontal: 12,
                        paddingVertical: 2,
                    },
                    drawerLabelStyle: {
                        fontSize: 16,
                        fontWeight: '500',
                        marginLeft: -8,
                    },
                }}
            >
                <Drawer.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Home' }}
                />
                <Drawer.Screen
                    name="Doctors"
                    component={PlaceholderScreen}
                    options={{ title: 'Doctors' }}
                />
                <Drawer.Screen
                    name="Labs"
                    component={PlaceholderScreen}
                    options={{ title: 'Labs' }}
                />
                <Drawer.Screen
                    name="LabTests"
                    component={PlaceholderScreen}
                    options={{ title: 'Lab Tests' }}
                />
                <Drawer.Screen
                    name="Pricing"
                    component={PricingScreen}
                    options={{ title: 'Pricing' }}
                />
                <Drawer.Screen
                    name="About"
                    component={AboutScreen}
                    options={{ title: 'About' }}
                />
                <Drawer.Screen
                    name="Contact"
                    component={ContactUsScreen}
                    options={{ title: 'Contact' }}
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
        </NavigationContainer>
    );
};

export default AppNavigator;
