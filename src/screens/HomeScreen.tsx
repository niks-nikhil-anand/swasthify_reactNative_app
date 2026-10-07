import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useColorScheme } from 'nativewind';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

import Hero from '../components/Hero';
import DoctorSearchBar from '../components/DoctorSearchBar';
import DoctorLocationRow from '../components/DoctorLocationRow';
import CareJourney from '../components/CareJourney';
import HealthConcernGrid from '../components/HealthConcernGrid';
import InClinicSpecialities from '../components/InClinicSpecialities';
import Footer from '../components/Footer';
import IntegratedServices from '../components/IntegratedServices';
import BookAppointmentCTA from '../components/BookAppointmentCTA';
import AbhaIdSection from '../components/AbhaIdSection';
import Specialities from '../components/Specialities';
import DoctorSection from '../components/DoctorSection';

type Props = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
    const { user } = useAuth();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [imgError, setImgError] = React.useState(false);

    React.useEffect(() => {
        setImgError(false);
    }, [user?.profilePic]);

    const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'Swasthify User';
    const firstName = displayName.split(/\s+/)[0];
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('') || 'SU';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#09090B]" edges={['top', 'left', 'right']}>
            {/* Top bar Header */}
            <View className="flex-row items-center px-5 py-4 gap-x-4">
                <TouchableOpacity 
                    onPress={() => navigation.openDrawer()}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-100 dark:border-slate-800"
                >
                    <Menu size={22} color={isDark ? "#94A3B8" : "#0F172A"} />
                </TouchableOpacity>
                
                <View className="flex-1">
                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Good morning</Text>
                    <Text className="text-[17px] font-black text-slate-900 dark:text-white leading-tight">
                        {firstName} 👋
                    </Text>
                </View>

                <TouchableOpacity 
                    onPress={() => navigation.navigate('Profile')}
                    className="w-10 h-10 rounded-full bg-[#FF9F43] items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden"
                >
                    {user?.profilePic && !imgError ? (
                        <Image
                            source={{ uri: user.profilePic }}
                            className="w-full h-full"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <Text className="text-white text-[13px] font-black">{initials}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <Hero />
                <View className="mt-2" />
                <DoctorSearchBar />
                <DoctorLocationRow />
                <DoctorSection />
                <HealthConcernGrid />
                <InClinicSpecialities />
                <Specialities />
                <BookAppointmentCTA />
                <IntegratedServices />
                <CareJourney />
                <AbhaIdSection />
                <View className="h-4" />
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
