import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import IntegratedServices from '../components/IntegratedServices';
import BookAppointmentCTA from '../components/BookAppointmentCTA';
import HealthPackages from '../components/HealthPackages';
import LabTestCTA from '../components/LabTestCTA';
import AbhaIdSection from '../components/AbhaIdSection';
import HowItWorks from '../components/HowItWorks';
import Specialities from '../components/Specialities';

const HomeScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Navbar />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Hero />
                <IntegratedServices />
                <BookAppointmentCTA />
                <Specialities />
                <HealthPackages />
                <LabTestCTA />
                <HowItWorks />
                <AbhaIdSection />
                {/* Repeating Book Appointment CTA as per user request point 8 if desired, or leaving it as one strong CTA */}
                <View className="h-4" />
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default HomeScreen;
