import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUp: undefined;
    About: undefined;
    ContactUs: undefined;
    Pricing: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Home'
>;

export type SignInScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SignIn'
>;

export type SignUpScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SignUp'
>;
