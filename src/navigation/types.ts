import { DrawerNavigationProp } from '@react-navigation/drawer';

export type RootDrawerParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUp: undefined;
    About: undefined;
    Contact: undefined;
    Pricing: undefined;
    FAQ: undefined;
    Doctors: undefined;
    Labs: undefined;
    Appointments: undefined;
    HealthRecords: undefined;
    Profile: undefined;
    CampaignDetail: { id: string };
    Specialities: undefined;
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
