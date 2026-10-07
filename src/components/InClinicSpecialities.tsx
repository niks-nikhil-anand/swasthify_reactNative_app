import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const specialities = [
    {
        title: 'Dentist',
        description: 'Teething troubles? Schedule a dental checkup',
        image: require('../assets/specialities/dentist_v2.png'),
        specialization: 'Dentistry',
    },
    {
        title: 'Gynecologist/Obstetrician',
        description: "Explore for women's health, pregnancy and infertility treatments",
        image: require('../assets/specialities/gynecologist_v2.png'),
        specialization: 'Gynaecology',
    },
    {
        title: 'Dietitian/Nutrition',
        description: 'Get guidance on eating right, weight management and sports nutrition',
        image: require('../assets/specialities/dietitian_v2.png'),
        query: 'dietitian nutrition',
    },
    {
        title: 'Physiotherapist',
        description: 'Pulled a muscle? Get it treated by a trained physiotherapist',
        image: require('../assets/specialities/physiotherapist_v2.png'),
        query: 'physiotherapist',
    },
];

const InClinicSpecialities = () => {
    const navigation = useNavigation<any>();

    const openSpeciality = (item: typeof specialities[number]) => {
        navigation.navigate('Doctors', {
            query: item.query || '',
            specialization: item.specialization || 'All',
        });
    };

    return (
        <View className="py-12 bg-white dark:bg-slate-950">
            <View className="px-5 mb-8">
                <Text className="text-3xl font-black text-slate-950 dark:text-white leading-tight">
                    Book an Appointment for{' '}
                    <Text className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">In-Clinic Consultation</Text>
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-base leading-7 mt-3">
                    Find experienced doctors across all specialties and book your visit in seconds.
                </Text>
            </View>

            <FlatList
                horizontal
                data={specialities}
                keyExtractor={(item) => item.title}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => openSpeciality(item)}
                        className="w-[260px] rounded-[26px] overflow-hidden bg-zinc-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                    >
                        <Image source={item.image} className="w-full h-36" resizeMode="cover" />
                        <View className="p-5 items-center">
                            <Text className="text-slate-950 dark:text-white text-lg font-black text-center" numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-[13px] leading-5 text-center mt-3" numberOfLines={2}>
                                {item.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default InClinicSpecialities;
