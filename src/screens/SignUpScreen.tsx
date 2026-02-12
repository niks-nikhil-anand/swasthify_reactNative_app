import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const SignUpScreen = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
                <Text className="text-3xl font-bold text-foreground mb-8 text-center">Create Account</Text>

                <View className="space-y-4">
                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <Text className="text-foreground mb-2 font-medium">First Name</Text>
                            <TextInput
                                placeholder="John"
                                className="border border-border rounded-lg p-3 w-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground mb-2 font-medium">Last Name</Text>
                            <TextInput
                                placeholder="Doe"
                                className="border border-border rounded-lg p-3 w-full"
                            />
                        </View>
                    </View>

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

                    <View>
                        <Text className="text-foreground mb-2 font-medium">Confirm Password</Text>
                        <TextInput
                            placeholder="••••••••"
                            className="border border-border rounded-lg p-3 w-full"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity className="bg-primary p-4 rounded-lg mt-6">
                        <Text className="text-primary-foreground text-center font-bold text-lg">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-muted-foreground">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text className="text-primary font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default SignUpScreen;
