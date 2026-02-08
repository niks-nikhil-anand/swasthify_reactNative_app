import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const Navbar = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View className="bg-white shadow-md z-50">
            <View className="flex-row justify-between items-center p-4">
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text className="text-xl font-bold text-blue-600">Swastify</Text>
                </TouchableOpacity>

                {/* Mobile-friendly horizontal scroll for menu items if needed, or just wrap */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row ml-4 mr-2">
                    <TouchableOpacity onPress={() => navigation.navigate('About')} className="px-3"><Text className="text-gray-600 font-medium">About</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Pricing')} className="px-3"><Text className="text-gray-600 font-medium">Pricing</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} className="px-3"><Text className="text-gray-600 font-medium">Contact</Text></TouchableOpacity>
                </ScrollView>
            </View>

            <View className="flex-row justify-end px-4 pb-3 space-x-3 border-t border-gray-100 pt-2">
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')} className="px-3 py-2">
                    <Text className="text-gray-700 font-medium">Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Navbar;
