import { DrawerNavigationProp } from '@react-navigation/drawer';

export type RootDrawerParamList = {
    Onboarding: undefined;
    Home: undefined;
    SignIn: undefined;
    SignUp: undefined;
    About: undefined;
    Contact: undefined;
    Pricing: undefined;
    FAQ: undefined;
    Doctors: { query?: string } | undefined;
    Labs: undefined;
    Appointments: undefined;
    HealthRecords: undefined;
    Profile: undefined;
    CampaignDetail: { id: string };
    Specialities: undefined;
    PackageDetail: {
        id: string;
        title: string;
        price: string;
        features: string;
        image: any;
        isRecommended?: boolean;
    };
};

export type HomeScreenNavigationProp = DrawerNavigationProp<
    RootDrawerParamList,
    'Home'
>;

export type SignInScreenNavigationProp = DrawerNavigationProp<
    RootDrawerParamList,
    'SignIn'
>;

export type SignUpScreenNavigationProp = DrawerNavigationProp<
    RootDrawerParamList,
    'SignUp'
>;
