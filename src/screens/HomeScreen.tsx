import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useColorScheme } from 'nativewind';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

import Hero from '../components/Hero';
import DoctorSearchBar from '../components/DoctorSearchBar';
import Footer from '../components/Footer';
import IntegratedServices from '../components/IntegratedServices';
import BookAppointmentCTA from '../components/BookAppointmentCTA';
import HealthPackages from '../components/HealthPackages';
import LabTestCTA from '../components/LabTestCTA';
import AbhaIdSection from '../components/AbhaIdSection';
import Specialities from '../components/Specialities';
import DoctorSection from '../components/DoctorSection';
import LabSection from '../components/LabSection';

type Props = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
    const { user } = useAuth();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#09090B]">
            {/* Top bar Header */}
            <View className="flex-row items-center px-5 py-3 gap-x-4">
                <TouchableOpacity 
                    onPress={() => navigation.openDrawer()}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-100 dark:border-slate-800"
                >
                    <Menu size={22} color={isDark ? "#94A3B8" : "#0F172A"} />
                </TouchableOpacity>
                
                <View className="flex-1">
                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Good morning</Text>
                    <Text className="text-[17px] font-black text-slate-900 dark:text-white leading-tight">
                        {user?.name?.split(' ')[0] || 'Ayan'} Singh 👋
                    </Text>
                </View>

                <View className="relative">
                    <TouchableOpacity 
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-100 dark:border-slate-800"
                    >
                        <Bell size={22} color={isDark ? "#94A3B8" : "#0F172A"} />
                    </TouchableOpacity>
                    <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-[#09090B]" />
                </View>

                <TouchableOpacity 
                    onPress={() => navigation.navigate('Home', { screen: 'ProfileTab' })}
                    className="w-10 h-10 rounded-full bg-[#FF9F43] items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden"
                >
                    {user?.profilePic ? (
                        <Image source={{ uri: user.profilePic }} className="w-full h-full" />
                    ) : (
                        <Text className="text-white text-[13px] font-black">AS</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <Hero />
                <View className="mt-2" />
                <DoctorSearchBar />
                <Specialities />
                <IntegratedServices />
                <BookAppointmentCTA />
                <DoctorSection />
                <HealthPackages />
                <LabTestCTA />
                <LabSection />
                <AbhaIdSection />
                <View className="h-4" />
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
