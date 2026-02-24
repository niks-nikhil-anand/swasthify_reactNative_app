import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Image,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

// Taller banner — fills full width, no padding
const BANNER_HEIGHT = width * 0.58;

interface Slide {
    id: string;
    image: ImageSourcePropType;
    accentColor: string;
}

const slides: Slide[] = [
    {
        id: '1',
        image: require('../../public/images/hero_banner_1.png'),
        accentColor: '#0DA96E',
    },
    {
        id: '2',
        image: require('../../public/images/hero_banner_2.jpg'),
        accentColor: '#7C3AED',
    },
    {
        id: '3',
        image: require('../../public/images/hero_banner_3.jpg'),
        accentColor: '#2563EB',
    },
];

const Hero = () => {
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const next = (activeIndex + 1) % slides.length;
            flatListRef.current?.scrollToIndex({ index: next, animated: true });
            setActiveIndex(next);
        }, 3800);
        return () => clearInterval(timer);
    }, [activeIndex]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const activeSlide = slides[activeIndex];

    const renderSlide = ({ item }: { item: Slide }) => (
        <View style={styles.slideContainer}>
            <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );

    return (
        <View style={styles.root}>
            {/* Full-width Slider — no horizontal padding */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />

            {/* Pagination Dots */}
            <View style={styles.dotsRow}>
                {slides.map((_, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            flatListRef.current?.scrollToIndex({ index: i, animated: true });
                            setActiveIndex(i);
                        }}
                    >
                        <View
                            style={[
                                styles.dot,
                                {
                                    width: i === activeIndex ? 22 : 7,
                                    backgroundColor:
                                        i === activeIndex ? activeSlide.accentColor : '#D1D5DB',
                                },
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        // Transparent by default to show parent background
    },
    slideContainer: {
        width: width,
        height: BANNER_HEIGHT,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 10,
    },
});

export default Hero;
