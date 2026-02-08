import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const HomeScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Navbar />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Hero />
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default HomeScreen;
