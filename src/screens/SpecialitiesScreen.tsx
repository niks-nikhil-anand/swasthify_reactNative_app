import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40 - 24) / 3; // 40 is total horizontal padding, 24 is gap between columns

const SPECIALITIES = [
    {
        title: "Gynaecology",
        price: "₹599",
        image: require('../assets/specialities/gynaecology_real.png'),
        color: "bg-pink-50/50 dark:bg-pink-900/20",
    },
    {
        title: "Sexology",
        price: "₹599",
        image: require('../assets/specialities/sexology_real.png'),
        color: "bg-indigo-50/50 dark:bg-indigo-900/20",
    },
    {
        title: "General physician",
        price: "₹499",
        image: require('../assets/specialities/general_physician_real.png'),
        color: "bg-blue-50/50 dark:bg-blue-900/20",
    },
    {
        title: "Dermatology",
        price: "₹549",
        image: require('../assets/specialities/dermatology_real_v2.png'),
        color: "bg-teal-50/50 dark:bg-teal-900/20",
    },
    {
        title: "Psychiatry",
        price: "₹599",
        image: require('../assets/specialities/psychiatry_real.png'),
        color: "bg-green-50/50 dark:bg-green-900/20",
    },
    {
        title: "Stomach and digestion",
        price: "₹499",
        image: require('../assets/specialities/stomach_digestion_real.png'),
        color: "bg-orange-50/50 dark:bg-orange-900/20",
    },
    {
        title: "Cardiology",
        price: "₹799",
        image: require('../assets/specialities/cardiology_real.jpg'),
        color: "bg-red-50/50 dark:bg-red-900/20",
    },
    {
        title: "Pediatrics",
        price: "₹499",
        image: require('../assets/specialities/pediatrics_real.jpg'),
        color: "bg-yellow-50/50 dark:bg-yellow-900/20",
    },
    {
        title: "Orthopedics",
        price: "₹599",
        image: require('../assets/specialities/orthopedics_real.jpg'),
        color: "bg-orange-50/50 dark:bg-orange-900/20",
    },
    {
        title: "Neurology",
        price: "₹899",
        image: require('../assets/specialities/neurology_real.jpg'),
        color: "bg-purple-50/50 dark:bg-purple-900/20",
    },
    {
        title: "Ophthalmology",
        price: "₹499",
        image: require('../assets/specialities/ophthalmology_real.jpg'),
        color: "bg-sky-50/50 dark:bg-sky-900/20",
    },
    {
        title: "Dentist",
        price: "₹249",
        image: require('../assets/specialities/dentist_v2.png'),
        color: "bg-slate-50/50 dark:bg-slate-900/20",
    },
    {
        title: "Dietitian",
        price: "₹349",
        image: require('../assets/specialities/dietitian_v2.png'),
        color: "bg-lime-50/50 dark:bg-lime-900/20",
    },
    {
        title: "Physiotherapist",
        price: "₹449",
        image: require('../assets/specialities/physiotherapist_v2.png'),
        color: "bg-cyan-50/50 dark:bg-cyan-900/20",
    },
];

const SpecialitiesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 dark:bg-slate-800"
                >
                    <Feather name="chevron-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="ml-4 text-xl font-bold text-[#111827] dark:text-white">
                    All Specialities
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
            >
                <View className="mb-8">
                    <Text className="text-2xl font-black text-[#111827] dark:text-white mb-2">
                        Find the Right Specialist
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations.
                    </Text>
                </View>

                <View className="flex-row flex-wrap justify-between gap-y-6">
                    {SPECIALITIES.map((spec, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ width: COLUMN_WIDTH }}
                            onPress={() => navigation.navigate('Doctors')}
                            activeOpacity={0.7}
                            className="items-center"
                        >
                            <View className={`w-full aspect-square rounded-[24px] overflow-hidden items-center justify-center p-2 mb-2 ${spec.color}`}>
                                <Image
                                    source={spec.image}
                                    style={{ width: '80%', height: '80%' }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-[11px] font-bold text-[#111827] dark:text-white text-center mb-1" numberOfLines={2}>
                                {spec.title}
                            </Text>
                            <Text className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                                from <Text className="text-[#0DA96E]">{spec.price}</Text>
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SpecialitiesScreen;
