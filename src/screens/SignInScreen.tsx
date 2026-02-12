import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const SignInScreen = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 justify-center p-6">
                <Text className="text-3xl font-bold text-foreground mb-8 text-center">Welcome Back</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-foreground mb-2 font-medium">Email Address</Text>
                        <TextInput
                            placeholder="you@example.com"
                            className="border border-border rounded-lg p-3 w-full"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-foreground mb-2 font-medium">Password</Text>
                        <TextInput
                            placeholder="••••••••"
                            className="border border-border rounded-lg p-3 w-full"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity className="bg-primary p-4 rounded-lg mt-6">
                        <Text className="text-primary-foreground text-center font-bold text-lg">Sign In</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-muted-foreground">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text className="text-primary font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Footer />
        </SafeAreaView>
    );
};

export default SignInScreen;
