import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';

const PricingCard = ({ title, price, features, isPopular, buttonText }: { title: string, price: string, features: string[], isPopular?: boolean, buttonText: string }) => (
    <View className={`p-6 rounded-2xl border ${isPopular ? 'border-primary bg-primary/10' : 'border-border bg-card'} mb-6 shadow-sm`}>
        {isPopular && (
            <View className="bg-primary self-start px-3 py-1 rounded-full mb-2">
                <Text className="text-primary-foreground text-xs font-bold uppercase">Most Popular</Text>
            </View>
        )}
        <Text className="text-2xl font-bold text-foreground mb-2">{title}</Text>
        <Text className="text-4xl font-extrabold text-foreground mb-6">{price}<Text className="text-lg font-normal text-muted-foreground">/mo</Text></Text>

        <View className="mb-6 space-y-2">
            {features.map((feature, index) => (
                <View key={index} className="flex-row items-center">
                    <Text className="text-primary mr-2">✓</Text>
                    <Text className="text-foreground">{feature}</Text>
                </View>
            ))}
        </View>

        <TouchableOpacity className={`p-3 rounded-lg ${isPopular ? 'bg-primary' : 'bg-foreground'}`}>
            <Text className={`text-center font-bold ${isPopular ? 'text-primary-foreground' : 'text-background'}`}>{buttonText}</Text>
        </TouchableOpacity>
    </View>
);

const PricingScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <Text className="text-3xl font-bold text-foreground mb-2 text-center">Simple, Transparent Pricing</Text>
                <Text className="text-muted-foreground text-center mb-8">Choose the plan that's right for you.</Text>

                <PricingCard
                    title="Free"
                    price="$0"
                    features={['Basic Appointment Booking', 'Access to Health Tips', 'Standard Support']}
                    buttonText="Get Started"
                    isPopular={false}
                />

                <PricingCard
                    title="Premium"
                    price="$19"
                    features={['Priority Booking', '24/7 Doctor Consultations', 'Advanced Health Analytics', 'Ad-free Experience']}
                    buttonText="Upgrade to Premium"
                    isPopular={true}
                />

                <PricingCard
                    title="Enterprise"
                    price="$99"
                    features={['Family Health Management', 'Dedicated Health Coach', 'VIP Support Access', 'Custom Health Plans']}
                    buttonText="Contact Sales"
                    isPopular={false}
                />
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default PricingScreen;
