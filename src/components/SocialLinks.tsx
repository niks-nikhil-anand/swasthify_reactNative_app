import React from 'react';
import { View, TouchableOpacity, Linking, Text } from 'react-native';
import { Linkedin, Facebook, Instagram } from 'lucide-react-native';

const SocialLinks = () => {
    const socials = [
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} color="#0A66C2" />,
            url: 'https://www.linkedin.com/company/swasthify-healthcare/',
            bg: 'bg-[#0A66C2]/10',
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} color="#1877F2" />,
            url: 'https://www.facebook.com/share/1CvB36owEe/',
            bg: 'bg-[#1877F2]/10',
        },
        {
            name: 'Instagram',
            icon: <Instagram size={20} color="#E4405F" />,
            url: 'https://www.instagram.com/swasthify_in?igsh=MWk4eWp6bjF5Y3I0cw==',
            bg: 'bg-[#E4405F]/10',
        },
    ];

    return (
        <View className="flex-row items-center gap-4">
            {socials.map((social, index) => (
                <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => Linking.openURL(social.url)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${social.bg}`}
                >
                    {social.icon}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SocialLinks;
