import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const ProfileScreen = () => {
    const { user, logout, updateUser } = useAuth();
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [newPhone, setNewPhone] = useState(user?.phone || '');
    const [newName, setNewName] = useState(user?.name || '');
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    if (!user) return null;

    const handleUpdatePhone = async () => {
        if (newPhone.length !== 10 || isNaN(Number(newPhone))) {
            Alert.alert("Error", "Phone number must be exactly 10 digits");
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.updatePhone(newPhone);
            await updateUser({ phone: newPhone });
            Alert.alert("Success", "Phone number updated successfully");
            setPhoneModalVisible(false);
        } catch (err: any) {
            Alert.alert("Error", err.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleUpdateName = async () => {
        if (newName.trim().length < 2) {
            Alert.alert("Error", "Please enter a valid name");
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.updateName(newName);
            await updateUser({ name: newName });
            Alert.alert("Success", "Name updated successfully");
            setNameModalVisible(false);
        } catch (err: any) {
            Alert.alert("Error", err.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!validateEmail(newEmail)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.updateEmail(newEmail);
            await updateUser({ email: newEmail });
            Alert.alert("Success", "Email address updated successfully");
            setEmailModalVisible(false);
        } catch (err: any) {
            Alert.alert("Error", err.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    const validatePassword = (password: string) => {
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        return (
            password.length >= 6 &&
            password.length <= 16 &&
            hasNumber.test(password) &&
            hasSpecialChar.test(password)
        );
    };

    const handleChangePassword = async () => {
        if (!validatePassword(passwords.new)) {
            Alert.alert(
                "Error",
                "Password must be 6-16 characters long, contain at least one number and one special character"
            );
            return;
        }
        if (passwords.new !== passwords.confirm) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.changePassword(passwords.current, passwords.new);
            Alert.alert("Success", "Password changed successfully");
            setPasswordModalVisible(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            Alert.alert("Error", err.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    const ProfileItem = ({ icon, title, value, color = "#4B5563", onPress }: { icon: string, title: string, value: string, color?: string, onPress?: () => void }) => {
        const Content = (
            <View style={styles.itemContainer}>
                <View style={[styles.iconWrapper, { backgroundColor: color + '10' }]}>
                    <Feather name={icon} size={20} color={color} />
                </View>
                <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <Text style={styles.itemValue}>{value}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
            </View>
        );

        if (onPress) {
            return (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    {Content}
                </TouchableOpacity>
            );
        }

        return Content;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Profile Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/user_avatar.png')}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Feather name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>Account</Text>
                </View>

                {/* Profile Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.card}>
                        <ProfileItem
                            icon="user"
                            title="Full Name"
                            value={user.name}
                            color="#0DA96E"
                            onPress={() => setNameModalVisible(true)}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="mail"
                            title="Email Address"
                            value={user.email}
                            color="#3B82F6"
                            onPress={() => setEmailModalVisible(true)}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="phone"
                            title="Phone Number"
                            value={user.phone || "Not provided"}
                            color="#F59E0B"
                            onPress={() => setPhoneModalVisible(true)}
                        />
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings & Privacy</Text>
                    <View style={styles.card}>
                        <ProfileItem
                            icon="lock"
                            title="Change Password"
                            value="Update your security"
                            color="#6366F1"
                            onPress={() => setPasswordModalVisible(true)}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="bell"
                            title="Notifications"
                            value="Manage alerts"
                            color="#EC4899"
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                >
                    <Feather name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Swasthify v1.0.0</Text>
                </View>
            </ScrollView>

            {/* Phone Update Modal */}
            <Modal
                visible={phoneModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPhoneModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Phone Number</Text>
                            <TouchableOpacity onPress={() => setPhoneModalVisible(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mobile Number</Text>
                            <TextInput
                                style={styles.input}
                                value={newPhone}
                                onChangeText={setNewPhone}
                                keyboardType="phone-pad"
                                placeholder="Enter mobile number"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleUpdatePhone}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.modalButtonText}>Update Number</Text>
                            )}
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Password Change Modal */}
            <Modal
                visible={passwordModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Change Password</Text>
                            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                value={passwords.current}
                                onChangeText={(text) => setPasswords({ ...passwords, current: text })}
                                secureTextEntry
                                placeholder="Enter current password"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={passwords.new}
                                onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                                secureTextEntry
                                placeholder="Enter new password"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={passwords.confirm}
                                onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                                secureTextEntry
                                placeholder="Confirm new password"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#6366F1' }]}
                            onPress={handleChangePassword}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.modalButtonText}>Change Password</Text>
                            )}
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Name Update Modal */}
            <Modal
                visible={nameModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setNameModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Full Name</Text>
                            <TouchableOpacity onPress={() => setNameModalVisible(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Enter full name"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#0DA96E' }]}
                            onPress={handleUpdateName}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.modalButtonText}>Update Name</Text>
                            )}
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Email Update Modal */}
            <Modal
                visible={emailModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEmailModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Email Address</Text>
                            <TouchableOpacity onPress={() => setEmailModalVisible(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={newEmail}
                                onChangeText={setNewEmail}
                                keyboardType="email-address"
                                placeholder="Enter new email address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#3B82F6' }]}
                            onPress={handleUpdateEmail}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.modalButtonText}>Update Email</Text>
                            )}
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const BRAND_GREEN = '#0DA96E';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#F1F5F9',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: BRAND_GREEN,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 2,
    },
    itemValue: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 56,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 40,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    versionText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    modalButton: {
        backgroundColor: BRAND_GREEN,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ProfileScreen;
