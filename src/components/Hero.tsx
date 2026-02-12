import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const Hero = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <View className="flex-1 items-center justify-center p-6 bg-primary/5">
            <Text className="text-4xl font-extrabold text-foreground text-center mb-4">
                Your Health, Our Priority
            </Text>
            <Text className="text-lg text-muted-foreground text-center mb-8">
                Book appointments, consult with top doctors, and manage your health seamlessly.
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                className="bg-primary px-8 py-3 rounded-full shadow-lg"
            >
                <Text className="text-primary-foreground text-lg font-bold">Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Hero;
