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
import SocialLinks from '../components/SocialLinks';
import Feather from 'react-native-vector-icons/Feather';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

/* ─── Contact Info items ─── */
const contactItems = [
    {
        icon: 'phone',
        title: 'Phone Number',
        lines: ['+91 97592 25515'],
        iconBg: 'bg-[#0DA96E]/10',
        action: () => Linking.openURL('tel:+919759225515'),
    },
    {
        icon: 'mail',
        title: 'Email Address',
        lines: ['support@swasthify.in'],
        iconBg: 'bg-[#0DA96E]/10',
        action: () => Linking.openURL('mailto:support@swasthify.in'),
    },
    {
        icon: 'map-pin',
        title: 'Office Location',
        lines: ['Rajendra Nagar, Patna, Bihar 800016'],
        iconBg: 'bg-[#0DA96E]/10',
    },
    {
        icon: 'clock',
        title: 'Business Hours',
        lines: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM'],
        iconBg: 'bg-[#0DA96E]/10',
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
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ═══════════════ HERO SECTION ═══════════════ */}
                <View className="relative w-full py-14 overflow-hidden bg-[#F7FBF9] dark:bg-zinc-950 border-b border-[#D9F3E8] dark:border-zinc-900">
                    <View className="px-4 relative z-10 items-center">
                        <View className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-[#CDEFE2] dark:border-zinc-800 mb-5">
                            <Text className="text-[#0DA96E] dark:text-[#10B981] font-semibold text-xs uppercase tracking-wider">
                                We'd love to hear from you
                            </Text>
                        </View>

                        <Text className="text-4xl font-bold tracking-tight mb-5 text-center text-gray-900 dark:text-white leading-tight">
                            Get in Touch with{' '}
                            <Text className="text-[#0DA96E]">Swasthify</Text>
                        </Text>

                        <Text className="text-base text-gray-600 dark:text-zinc-400 text-center leading-7 max-w-lg mb-4">
                            Have questions about our services or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
                        </Text>
                    </View>
                </View>

                {/* ═══════════════ MAIN CONTENT ═══════════════ */}
                <View className="py-12 bg-white dark:bg-zinc-950">
                    <View className="px-4">

                        {/* ─── Contact Information ─── */}
                        <View className="mb-8">
                            <View className="self-start px-4 py-1.5 rounded-full border border-[#0DA96E]/20 bg-[#0DA96E]/5 mb-4">
                                <Text className="text-sm text-[#0DA96E] font-semibold">Support Desk</Text>
                            </View>
                            <Text className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                Contact Information
                            </Text>
                            <Text className="text-base text-gray-500 dark:text-zinc-400 leading-6 mb-6">
                                Fill out the form or contact us directly using the details below. Our team is ready to assist you.
                            </Text>

                            {/* Contact Cards */}
                            <View className="gap-4">
                                {contactItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={item.action ? 0.7 : 1}
                                        onPress={item.action}
                                        className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 shadow-sm"
                                    >
                                        <View className="p-4 flex-row items-start gap-4">
                                            <View className={`w-10 h-10 rounded-xl items-center justify-center ${item.iconBg}`}>
                                                <Feather name={item.icon} size={19} color="#0DA96E" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-bold text-base mb-1 text-gray-900 dark:text-white">
                                                    {item.title}
                                                </Text>
                                                {item.lines.map((line, i) => (
                                                    <Text key={i} className="text-sm text-gray-500 dark:text-zinc-400">
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
                        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 shadow-xl overflow-hidden relative">
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
                                        <Feather name="message-circle" size={20} color="#0DA96E" />
                                    </View>
                                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                                        Send us a Message
                                    </Text>
                                </View>

                                {/* Full Name */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900 dark:text-zinc-200">Full Name</Text>
                                    <TextInput
                                        value={formData.name}
                                        onChangeText={(v) => handleChange('name', v)}
                                        placeholder="John Doe"
                                        placeholderTextColor="#6B7280"
                                        className="h-10 bg-gray-100/30 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 text-sm text-gray-900 dark:text-zinc-100"
                                    />
                                </View>

                                {/* Email */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900 dark:text-zinc-200">Email Address</Text>
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={(v) => handleChange('email', v)}
                                        placeholder="john@example.com"
                                        placeholderTextColor="#6B7280"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="h-10 bg-gray-100/30 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 text-sm text-gray-900 dark:text-zinc-100"
                                    />
                                </View>

                                {/* Phone */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900 dark:text-zinc-200">Phone Number</Text>
                                    <View className="flex-row h-10 bg-gray-100/30 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                                        <View className="bg-gray-100/50 dark:bg-zinc-800/80 px-3 justify-center border-r border-gray-300 dark:border-zinc-700">
                                            <Text className="text-sm font-medium text-gray-500 dark:text-zinc-400">+91</Text>
                                        </View>
                                        <TextInput
                                            value={formData.phone}
                                            onChangeText={(v) => handleChange('phone', v)}
                                            placeholder="9876543210"
                                            placeholderTextColor="#6B7280"
                                            keyboardType="phone-pad"
                                            className="flex-1 px-3 text-sm text-gray-900 dark:text-zinc-100"
                                        />
                                    </View>
                                </View>

                                {/* Subject */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium mb-2 text-gray-900 dark:text-zinc-200">Subject</Text>
                                    <TextInput
                                        value={formData.subject}
                                        onChangeText={(v) => handleChange('subject', v)}
                                        placeholder="How can we help?"
                                        placeholderTextColor="#6B7280"
                                        className="h-10 bg-gray-100/30 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 text-sm text-gray-900 dark:text-zinc-100"
                                    />
                                </View>

                                {/* Message */}
                                <View className="mb-6">
                                    <Text className="text-sm font-medium mb-2 text-gray-900 dark:text-zinc-200">Message</Text>
                                    <TextInput
                                        value={formData.message}
                                        onChangeText={(v) => handleChange('message', v)}
                                        placeholder="Tell us more about your inquiry..."
                                        placeholderTextColor="#6B7280"
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                        className="bg-gray-100/30 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 pt-3 text-sm text-gray-900 dark:text-zinc-100"
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
                    <View className="bg-[#0DA96E]/5 dark:bg-[#0DA96E]/10 rounded-2xl border border-[#0DA96E]/10 dark:border-[#0DA96E]/20 p-8 items-center">
                        <Text className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                            Still have questions?
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-6 mb-6 px-2">
                            Our team is here to help. But if you're ready to get started, you can register for free right now.
                        </Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('About')}
                                className="bg-[#0DA96E] px-6 py-3 rounded-lg mr-3 shadow-md"
                            >
                                <Text className="text-white font-semibold text-sm">
                                    About Us
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('FAQ')}
                                className="border border-gray-300 dark:border-zinc-700 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-gray-900 dark:text-zinc-200 font-semibold text-sm">
                                    View FAQ
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* ═══════════════ SOCIAL SECTION ═══════════════ */}
                <View className="px-4 pb-12 items-center">
                    <Text className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-6">Follow Us</Text>
                    <SocialLinks />
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUsScreen;
