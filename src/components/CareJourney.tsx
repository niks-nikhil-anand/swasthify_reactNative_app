import React from 'react';
import { Image, Text, View } from 'react-native';

const steps = [
    {
        image: require('../assets/care/care-search-doctor-3d.png'),
        title: 'Search Doctor',
        description: 'Find the best specialist near you or online for your specific needs.',
    },
    {
        image: require('../assets/care/care-book-appointment-3d.png'),
        title: 'Book Appointment',
        description: 'Choose a convenient time slot and book your appointment instantly.',
    },
    {
        image: require('../assets/care/care-consultation-3d.png'),
        title: 'Consultation',
        description: 'Visit the clinic or consult via video call with our expert doctors.',
    },
    {
        image: require('../assets/care/care-prescription-3d.png'),
        title: 'Get Prescription',
        description: 'Receive your digital prescription and medical records securely.',
    },
];

const CareJourney = () => {
    return (
        <View className="py-12 px-5 bg-white dark:bg-slate-950">
            <View className="items-center mb-8">
                <View className="flex-row items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 mb-4">
                    <View className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2" />
                    <Text className="text-[11px] font-black uppercase tracking-[3px] text-emerald-600 dark:text-emerald-400">
                        Your Care Journey
                    </Text>
                </View>
                <Text className="text-3xl font-black text-slate-950 dark:text-white text-center leading-tight">
                    Healthcare made <Text className="text-emerald-600 dark:text-emerald-400">simple</Text>
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-7 mt-3 px-4">
                    From finding care to keeping your records together, every step feels easier.
                </Text>
            </View>

            <View className="gap-y-4">
                {steps.map((step, index) => (
                    <View
                        key={step.title}
                        className="relative flex-row items-center rounded-[28px] border border-slate-100 dark:border-emerald-500/10 bg-zinc-50 dark:bg-slate-900/80 p-4"
                    >
                        {index < steps.length - 1 && (
                            <View className="absolute left-[47px] top-[86px] w-[1px] h-8 bg-emerald-500/25" />
                        )}
                        <View className="w-16 h-16 rounded-2xl border border-emerald-500/25 bg-white dark:bg-slate-950 items-center justify-center mr-4">
                            <Image source={step.image} className="w-14 h-14" resizeMode="contain" />
                            <View className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 dark:bg-emerald-400 border-4 border-zinc-50 dark:border-slate-900 items-center justify-center">
                                <Text className="text-[10px] font-black text-white dark:text-slate-950">
                                    {String(index + 1).padStart(2, '0')}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-950 dark:text-white text-base font-black mb-1">{step.title}</Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-[13px] leading-5">{step.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default CareJourney;
