import React, { useState, useEffect } from 'react';
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
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth, User } from '../context/AuthContext';
import { userService } from '../services/userService';

const ProfileScreen = () => {
    const { user, logout, updateUser, refreshUser } = useAuth();
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [user?.profilePic]);

    // Form states
    const [newPhone, setNewPhone] = useState(user?.phone || '');
    const [newName, setNewName] = useState(user?.name || '');
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Generic Edit Modal states
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<keyof User | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingValue, setEditingValue] = useState('');
    const [modalType, setModalType] = useState<'TEXT' | 'SELECT' | 'DATE' | 'PHONE'>('TEXT');

    // For DATE type
    const [dobParts, setDobParts] = useState({ day: '', month: '', year: '' });

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const genders = ['Male', 'Female', 'Other'];
    const notificationOptions = ['Enabled', 'Disabled'];

    if (!user) return null;

    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo' as const,
            quality: 0.8 as const,
        };

        try {
            const result = await launchImageLibrary(options);

            if (result.didCancel) return;

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;

                setIsUploading(true);

                // 1. Upload to S3
                const formData = new FormData();
                formData.append('file', {
                    uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || 'profile.jpg',
                } as any);
                formData.append('type', 'profile');

                const uploadRes = await userService.uploadImage(formData);
                const s3Url = uploadRes.url;

                // 2. Update profile in database
                await userService.updateProfilePic(s3Url);

                // 3. Refresh user data from /api/auth/me (as suggested by user)
                await refreshUser();
                setImgError(false);

                Alert.alert("Success", "Profile picture updated successfully");
            }
        } catch (err: any) {
            console.error('Image pick/upload error:', err);
            Alert.alert("Error", err.toString() || "Failed to update profile picture");
        } finally {
            setIsUploading(false);
        }
    };

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

    const handleUpdateProfile = async (field: keyof User, value: string) => {
        let finalValue = value;

        if (field === 'phone') {
            if (!value.startsWith('+91')) {
                finalValue = '+91' + value;
            }
            if (finalValue.length !== 13) {
                Alert.alert("Error", "Please enter a valid 10-digit mobile number");
                return;
            }
        }

        if (!finalValue.trim()) {
            Alert.alert("Error", "Please enter a valid value");
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.updateProfile({ [field]: finalValue });
            await updateUser({ [field]: finalValue });
            Alert.alert("Success", "Profile updated successfully");
            setEditModalVisible(false);
        } catch (err: any) {
            Alert.alert("Error", err.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (field: keyof User, title: string, currentValue: string, type: 'TEXT' | 'SELECT' | 'DATE' | 'PHONE' = 'TEXT') => {
        setEditingField(field);
        setEditingTitle(title);
        setModalType(type);

        if (type === 'DATE') {
            const parts = (currentValue || '').split('-');
            setDobParts({
                day: parts[0] || '',
                month: parts[1] || '',
                year: parts[2] || ''
            });
        } else if (type === 'PHONE') {
            setEditingValue(currentValue.replace('+91', '') || '');
        } else {
            setEditingValue(currentValue || '');
        }

        setEditModalVisible(true);
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
                        {isUploading ? (
                            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' }]}>
                                <ActivityIndicator color="#0DA96E" />
                            </View>
                        ) : (
                            <Image
                                source={user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                style={styles.avatar}
                                onError={() => setImgError(true)}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={handleImagePick}
                            disabled={isUploading}
                        >
                            <Feather name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>Account</Text>
                </View>

                {/* Account Information */}
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
                            onPress={() => openEditModal('phone', 'Phone Number', user.phone || '', 'PHONE')}
                        />
                    </View>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.card}>
                        <ProfileItem
                            icon="calendar"
                            title="Date of Birth"
                            value={user.dob || "Not set"}
                            color="#8B5CF6"
                            onPress={() => openEditModal('dob', 'Date of Birth', user.dob || '', 'DATE')}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="users"
                            title="Gender"
                            value={user.gender || "Not set"}
                            color="#EC4899"
                            onPress={() => openEditModal('gender', 'Gender', user.gender || '', 'SELECT')}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="droplet"
                            title="Blood Group"
                            value={user.bloodGroup || "Not set"}
                            color="#EF4444"
                            onPress={() => openEditModal('bloodGroup', 'Blood Group', user.bloodGroup || '', 'SELECT')}
                        />
                    </View>
                </View>

                {/* Health Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Metrics</Text>
                    <View style={styles.card}>
                        <ProfileItem
                            icon="maximize-2"
                            title="Height"
                            value={user.height ? `${user.height} ft.` : "Not set"}
                            color="#10B981"
                            onPress={() => openEditModal('height', 'Height', user.height || '')}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="activity"
                            title="Weight"
                            value={user.weight ? `${user.weight} kg` : "Not set"}
                            color="#3B82F6"
                            onPress={() => openEditModal('weight', 'Weight', user.weight || '')}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="alert-circle"
                            title="Allergies"
                            value={user.allergies || "None"}
                            color="#F59E0B"
                            onPress={() => openEditModal('allergies', 'Allergies', user.allergies || '')}
                        />
                        <View style={styles.divider} />
                        <ProfileItem
                            icon="frown"
                            title="Diseases"
                            value={user.diseases || "None"}
                            color="#6366F1"
                            onPress={() => openEditModal('diseases', 'Diseases', user.diseases || '')}
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
                            title="Notification Manager"
                            value={user.notificationsEnabled || "Enabled"}
                            color="#EC4899"
                            onPress={() => openEditModal('notificationsEnabled', 'Notification Manager', user.notificationsEnabled || 'Enabled', 'SELECT')}
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
            {/* Generic/Specialized Update Modal */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update {editingTitle}</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {modalType === 'TEXT' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{editingTitle} {editingField === 'height' ? '(ft.)' : editingField === 'weight' ? '(kg)' : ''}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingValue}
                                    onChangeText={setEditingValue}
                                    placeholder={`Enter ${editingTitle.toLowerCase()}`}
                                    keyboardType={editingField === 'height' || editingField === 'weight' ? 'decimal-pad' : 'default'}
                                    multiline={editingField === 'allergies' || editingField === 'diseases'}
                                />
                            </View>
                        )}

                        {modalType === 'PHONE' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <View style={styles.phoneInputContainer}>
                                    <View style={styles.prefixContainer}>
                                        <Text style={styles.prefixText}>+91</Text>
                                    </View>
                                    <TextInput
                                        style={[styles.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                                        value={editingValue}
                                        onChangeText={setEditingValue}
                                        placeholder="10 digit number"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </View>
                        )}

                        {modalType === 'SELECT' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Select {editingTitle}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
                                    {(editingField === 'bloodGroup' ? bloodGroups :
                                        editingField === 'notificationsEnabled' ? notificationOptions :
                                            genders).map((option) => (
                                                <TouchableOpacity
                                                    key={option}
                                                    style={[
                                                        styles.optionButton,
                                                        editingValue === option && styles.activeOptionButton
                                                    ]}
                                                    onPress={() => setEditingValue(option)}
                                                >
                                                    <Text style={[
                                                        styles.optionText,
                                                        editingValue === option && styles.activeOptionText
                                                    ]}>{option}</Text>
                                                </TouchableOpacity>
                                            ))}
                                </ScrollView>
                            </View>
                        )}

                        {modalType === 'DATE' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Date of Birth (DD-MM-YYYY)</Text>
                                <View style={styles.dateInputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.dateInput]}
                                        value={dobParts.day}
                                        onChangeText={(v) => setDobParts({ ...dobParts, day: v })}
                                        placeholder="DD"
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                    <Text style={styles.dateSeparator}>-</Text>
                                    <TextInput
                                        style={[styles.input, styles.dateInput]}
                                        value={dobParts.month}
                                        onChangeText={(v) => setDobParts({ ...dobParts, month: v })}
                                        placeholder="MM"
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                    <Text style={styles.dateSeparator}>-</Text>
                                    <TextInput
                                        style={[styles.input, { flex: 1.5 }]}
                                        value={dobParts.year}
                                        onChangeText={(v) => setDobParts({ ...dobParts, year: v })}
                                        placeholder="YYYY"
                                        keyboardType="number-pad"
                                        maxLength={4}
                                    />
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                if (modalType === 'DATE') {
                                    handleUpdateProfile('dob', `${dobParts.day}-${dobParts.month}-${dobParts.year}`);
                                } else if (modalType === 'PHONE') {
                                    handleUpdateProfile('phone', editingValue);
                                } else {
                                    editingField && handleUpdateProfile(editingField, editingValue);
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.modalButtonText}>Update {editingTitle}</Text>
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
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prefixContainer: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: '#E2E8F0',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'center',
    },
    prefixText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    selectionScroll: {
        flexDirection: 'row',
        marginTop: 8,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeOptionButton: {
        backgroundColor: BRAND_GREEN,
        borderColor: BRAND_GREEN,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    activeOptionText: {
        color: '#FFFFFF',
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInput: {
        flex: 1,
    },
    dateSeparator: {
        fontSize: 18,
        fontWeight: '700',
        color: '#CBD5E1',
        marginHorizontal: 8,
    },
});

export default ProfileScreen;
