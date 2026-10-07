import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const concerns = [
    { label: 'Fever & cold', icon: 'thermometer', query: 'fever cold' },
    { label: 'Headache', icon: 'activity', query: 'headache' },
    { label: 'Heart health', icon: 'heart', specialization: 'Cardiology' },
    { label: "Women's health", icon: 'user', specialization: 'Gynaecology' },
    { label: 'Child health', icon: 'smile', specialization: 'Pediatrics' },
    { label: 'Joint pain', icon: 'target', specialization: 'Orthopaedics' },
    { label: 'Digestive health', icon: 'coffee', specialization: 'Stomach and digestion' },
    { label: 'Skin concerns', icon: 'sun', specialization: 'Dermatology' },
];

const HealthConcernGrid = () => {
    const navigation = useNavigation<any>();

    const openConcern = (item: typeof concerns[number]) => {
        navigation.navigate('Doctors', {
            query: item.query || '',
            specialization: item.specialization || 'All',
        });
    };

    return (
        <View className="py-12 px-5 bg-zinc-50 dark:bg-slate-950">
            <View className="mb-8">
                <Text className="text-[12px] font-black uppercase tracking-[3px] text-emerald-600 dark:text-emerald-400 mb-3">
                    Start with how you feel
                </Text>
                <Text className="text-3xl font-black text-slate-950 dark:text-white leading-tight">
                    Not sure which doctor you need?
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-base leading-7 mt-3">
                    Tell us what you're looking for and we'll help you find the right care.
                </Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                {concerns.map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        activeOpacity={0.85}
                        onPress={() => openConcern(item)}
                        className="w-[48.5%] min-h-[118px] rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mb-3 justify-between"
                    >
                        <View className="w-11 h-11 rounded-2xl bg-emerald-500/10 items-center justify-center">
                            <Feather name={item.icon as any} size={20} color="#0DA96E" />
                        </View>
                        <Text className="text-slate-950 dark:text-white text-[15px] font-black leading-5">{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Specialities')}
                className="self-center mt-4 rounded-full border border-emerald-500/20 px-5 py-3 flex-row items-center"
            >
                <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-black mr-2">View all specialities</Text>
                <Feather name="arrow-up-right" size={16} color="#0DA96E" />
            </TouchableOpacity>
        </View>
    );
};

export default HealthConcernGrid;
