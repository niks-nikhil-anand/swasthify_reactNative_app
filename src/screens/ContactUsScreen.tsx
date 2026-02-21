import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Footer from '../components/Footer';
import { publicService } from '../services/publicService';
import { Alert } from 'react-native';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

/* ─── Contact Info items ─── */
const contactItems = [
    {
        emoji: '📞',
        title: 'Phone Number',
        lines: ['+91 97592 25515'],
        iconBg: 'bg-blue-500/10',
        action: () => Linking.openURL('tel:+919759225515'),
    },
    {
        emoji: '✉️',
        title: 'Email Address',
        lines: ['support@swasthify.com'],
        iconBg: 'bg-green-500/10',
        action: () => Linking.openURL('mailto:support@swasthify.com'),
    },
    {
        emoji: '📍',
        title: 'Office Location',
        lines: ['Rajendra nagar Patna Bihar 800016'],
        iconBg: 'bg-purple-500/10',
    },
    {
        emoji: '🕐',
        title: 'Business Hours',
        lines: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM'],
        iconBg: 'bg-orange-500/10',
    },
];

/* ─── Main Screen ─── */
const ContactUsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const { name, email, phone, subject, message } = formData;
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phone.trim() || !phoneRegex.test(phone)) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return false;
        }
        if (!subject.trim()) {
            Alert.alert('Error', 'Please enter a subject');
            return false;
        }
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter your message');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await publicService.createContactTicket(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            Alert.alert('Success', 'Your inquiry has been sent successfully!');
            setTimeout(() => setSubmitted(false), 3000);
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to send inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ═══════════════ HERO SECTION ═══════════════ */}
                <View className="relative w-full py-12 overflow-hidden bg-[#0DA96E]/5">
                    {/* Gradient overlay */}
                    <View className="absolute top-0 left-0 w-full h-full bg-white opacity-50" />
                    {/* Decorative blurred circle */}
                    <View className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#0DA96E]/10 rounded-full opacity-60" />

                    <View className="px-4 relative z-10 items-center">
                        {/* Badge */}
                        <View className="px-4 py-1.5 rounded-full bg-[#0DA96E]/10 mb-4">
                            <Text className="text-[#0DA96E] font-medium text-xs">
                                We'd love to hear from you
                            </Text>
                        </View>

                        {/* Title */}
                        <Text className="text-3xl font-bold tracking-tight mb-4 text-center text-gray-900">
                            Get in Touch with{' '}
                            <Text className="text-[#0DA96E]">Swastify</Text>
                        </Text>

                        {/* Subtitle */}
                        <Text className="text-base text-gray-500 text-center leading-6 max-w-lg mb-4">
                            Have questions about our services or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
                        </Text>
                    </View>
                </View>

                {/* ═══════════════ MAIN CONTENT ═══════════════ */}
                <View className="py-12">
                    <View className="px-4">

                        {/* ─── Contact Information ─── */}
                        <View className="mb-8">
                            <Text className="text-2xl font-bold mb-3 text-gray-900">
                                Contact Information
                            </Text>
                            <Text className="text-base text-gray-500 leading-6 mb-6">
                                Fill out the form or contact us directly using the details below. Our team is ready to assist you.
                            </Text>

                            {/* Contact Cards */}
                            <View className="gap-4">
                                {contactItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={item.action ? 0.7 : 1}
                                        onPress={item.action}
                                        className="bg-white rounded-xl border border-gray-300/50 shadow-sm"
                                    >
                                        <View className="p-4 flex-row items-start gap-4">
                                            <View className={`w-10 h-10 rounded-xl items-center justify-center ${item.iconBg}`}>
                                                <Text className="text-xl">{item.emoji}</Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-bold text-base mb-1 text-gray-900">
                                                    {item.title}
                                                </Text>
                                                {item.lines.map((line, i) => (
                                                    <Text key={i} className="text-sm text-gray-500">
                                                        {line}
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* ─── Contact Form Card ─── */}
                        <View className="bg-white rounded-xl border border-gray-300/50 shadow-xl overflow-hidden relative">
                            {/* Gradient accent bar */}
                            <View className="flex-row h-2">
                                <View className="flex-1 bg-[#0DA96E]" />
                                <View className="flex-1 bg-[#00C68A]" />
                            </View>

                            {/* Form Content */}
                            <View className="p-6">
                                {/* Header */}
                                <View className="flex-row items-center gap-3 mb-6">
                                    <View className="p-2 rounded-full bg-[#0DA96E]/10">
                                        <Text className="text-xl">💬</Text>
                                    </View>
                                    <Text className="text-xl font-bold text-gray-900">
                                        Send us a Message
                                    </Text>
                                </View>

                                {/* Full Name */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900">Full Name</Text>
                                    <TextInput
                                        value={formData.name}
                                        onChangeText={(v) => handleChange('name', v)}
                                        placeholder="John Doe"
                                        placeholderTextColor="#6B7280"
                                        className="h-10 bg-gray-100/30 border border-gray-300 rounded-lg px-4 text-sm text-gray-900"
                                    />
                                </View>

                                {/* Email */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900">Email Address</Text>
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={(v) => handleChange('email', v)}
                                        placeholder="john@example.com"
                                        placeholderTextColor="#6B7280"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="h-10 bg-gray-100/30 border border-gray-300 rounded-lg px-4 text-sm text-gray-900"
                                    />
                                </View>

                                {/* Phone */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900">Phone Number</Text>
                                    <View className="flex-row h-10 bg-gray-100/30 border border-gray-300 rounded-lg overflow-hidden">
                                        <View className="bg-gray-100/50 px-3 justify-center border-r border-gray-300">
                                            <Text className="text-sm font-medium text-gray-500">+91</Text>
                                        </View>
                                        <TextInput
                                            value={formData.phone}
                                            onChangeText={(v) => handleChange('phone', v)}
                                            placeholder="9876543210"
                                            placeholderTextColor="#6B7280"
                                            keyboardType="phone-pad"
                                            className="flex-1 px-3 text-sm text-gray-900"
                                        />
                                    </View>
                                </View>

                                {/* Subject */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900">Subject</Text>
                                    <TextInput
                                        value={formData.subject}
                                        onChangeText={(v) => handleChange('subject', v)}
                                        placeholder="How can we help?"
                                        placeholderTextColor="#6B7280"
                                        className="h-10 bg-gray-100/30 border border-gray-300 rounded-lg px-4 text-sm text-gray-900 "
                                    />
                                </View>

                                {/* Message */}
                                <View className="mb-6">
                                    <Text className="text-sm font-medium mb-2 text-gray-900">Message</Text>
                                    <TextInput
                                        value={formData.message}
                                        onChangeText={(v) => handleChange('message', v)}
                                        placeholder="Tell us more about your inquiry..."
                                        placeholderTextColor="#6B7280"
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                        className="bg-gray-100/30 border border-gray-300 rounded-lg px-4 pt-3 text-sm text-gray-900"
                                        style={{ minHeight: 140 }}
                                    />
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    activeOpacity={0.85}
                                    className={`w-full h-10 bg-[#0DA96E] rounded-lg items-center justify-center flex-row shadow-lg ${isSubmitting ? 'opacity-70' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <View className="flex-row items-center">
                                            <ActivityIndicator color="#FFF" size="small" />
                                            <Text className="text-base font-semibold text-white ml-2">
                                                Sending...
                                            </Text>
                                        </View>
                                    ) : submitted ? (
                                        <Text className="text-base font-semibold text-white">
                                            ✓  Message Sent!
                                        </Text>
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Text className="text-base font-semibold text-white">
                                                Send Message
                                            </Text>
                                            <Text className="text-base font-semibold text-white ml-2">→</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ═══════════════ CTA SECTION ═══════════════ */}
                <View className="px-4 pb-8">
                    <View className="bg-[#0DA96E]/5 rounded-2xl border border-[#0DA96E]/10 p-8 items-center">
                        <Text className="text-xl font-bold text-center mb-3 text-gray-900">
                            Still have questions?
                        </Text>
                        <Text className="text-sm text-gray-500 text-center leading-6 mb-6 px-2">
                            Our team is here to help. But if you're ready to get started, you can register for free right now.
                        </Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                className="bg-[#0DA96E] px-6 py-3 rounded-lg mr-3 shadow-md"
                            >
                                <Text className="text-white font-semibold text-sm">
                                    Register Now
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('FAQ')}
                                className="border border-gray-300 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-gray-900 font-semibold text-sm">
                                    View FAQ
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUsScreen;
