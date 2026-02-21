import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TextInput,
    Alert,
    Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import { healthRecordService, HealthRecord } from '../services/healthRecordService';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#0DA96E';
const STORAGE_LIMIT_MB = 1024; // 1 GB

const HealthRecordsScreen = () => {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const categories = ['Prescription', 'Lab Report', 'Vaccination', 'Imaging (X-Ray/MRI)', 'Other'];

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case 'Prescription': return { color: '#3B82F6', bg: '#EFF6FF', icon: 'pill' };
            case 'Vaccination': return { color: '#8B5CF6', bg: '#F5F3FF', icon: 'activity' };
            case 'Lab Report': return { color: '#10B981', bg: '#ECFDF5', icon: 'file-text' };
            case 'Imaging (X-Ray/MRI)': return { color: '#EF4444', bg: '#FEF2F2', icon: 'image' };
            default: return { color: '#F59E0B', bg: '#FFFBEB', icon: 'file' };
        }
    };

    const fetchRecords = async () => {
        try {
            const data = await healthRecordService.getHealthRecords();
            setRecords(data.documents || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecords();
    };

    const handlePickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            });
            setSelectedFile(res[0]);
            if (!title) setTitle(res[0].name || '');
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error(err);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !title) {
            Alert.alert('Error', 'Please select a file and enter a title');
            return;
        }

        setIsUploading(true);
        try {
            await healthRecordService.uploadHealthRecord({
                file: {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.type,
                },
                title,
                description,
                category,
            });
            Alert.alert('Success', 'Health record uploaded successfully');
            setIsModalVisible(false);
            resetForm();
            fetchRecords();
        } catch (error) {
            Alert.alert('Error', typeof error === 'string' ? error : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Other');
        setSelectedFile(null);
    };

    const totalUsedSize = records.reduce((acc, rec) => acc + (rec.sizeMb || 0), 0);
    const storagePercentage = Math.min((totalUsedSize / STORAGE_LIMIT_MB) * 100, 100);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color={BRAND_GREEN} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BRAND_GREEN]} />}
            >
                {/* Storage Status Bar */}
                <View className="bg-white p-5 rounded-3xl shadow-sm mb-6 border border-gray-100">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-emerald-50 rounded-2xl items-center justify-center mr-3">
                                <Feather name="database" size={20} color={BRAND_GREEN} />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-lg">Storage Status</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Used {totalUsedSize.toFixed(2)} MB of {STORAGE_LIMIT_MB / 1024} GB</Text>
                            </View>
                        </View>
                    </View>
                    <View className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-brand-green"
                            style={{ width: `${storagePercentage}%`, backgroundColor: BRAND_GREEN }}
                        />
                    </View>
                    <Text className="text-right text-xs font-semibold text-gray-400 mt-2">
                        {storagePercentage.toFixed(1)}% used
                    </Text>
                </View>

                {/* Records List */}
                <Text className="text-xl font-bold text-gray-900 mb-4 px-1">My Records</Text>

                {records.length === 0 ? (
                    <View className="bg-white p-10 rounded-3xl items-center justify-center border border-dashed border-gray-300">
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <Feather name="folder" size={32} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-900 font-bold text-lg mb-2">No Records Yet</Text>
                        <Text className="text-gray-500 text-center text-sm mb-6">
                            Start building your digital health profile by uploading your records securely.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(true)}
                            className="bg-brand-green px-8 py-3.5 rounded-2xl shadow-sm"
                            style={{ backgroundColor: BRAND_GREEN }}
                        >
                            <Text className="text-white font-bold text-base">Upload Your First Record</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    records.map((record) => {
                        const styles = getCategoryStyles(record.category);
                        return (
                            <TouchableOpacity
                                key={record.id}
                                className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 flex-row items-center"
                            >
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: styles.bg }}
                                >
                                    <Feather name={styles.icon as any} size={24} color={styles.color} />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-gray-900 font-bold text-base flex-1 mr-2" numberOfLines={1}>
                                            {record.title}
                                        </Text>
                                        <View
                                            className="px-2 py-1 rounded-lg"
                                            style={{ backgroundColor: styles.bg }}
                                        >
                                            <Text className="text-[10px] font-bold" style={{ color: styles.color }}>
                                                {record.category.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                                        {record.description || 'No description provided'}
                                    </Text>
                                    <View className="flex-row items-center mt-2">
                                        <Feather name="clock" size={12} color="#9CA3AF" />
                                        <Text className="text-gray-400 text-[10px] ml-1 mr-3">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </Text>
                                        <Feather name="hard-drive" size={12} color="#9CA3AF" />
                                        <Text className="text-gray-400 text-[10px] ml-1">
                                            {record.sizeMb.toFixed(2)} MB
                                        </Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={20} color="#D1D5DB" className="ml-2" />
                            </TouchableOpacity>
                        );
                    })
                )}
                <View className="h-20" />
            </ScrollView>

            {/* Fab Button */}
            {records.length > 0 && (
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    activeOpacity={0.9}
                    className="absolute bottom-8 right-6 w-16 h-16 bg-brand-green rounded-full shadow-xl items-center justify-center"
                    style={{ backgroundColor: BRAND_GREEN, elevation: 8 }}
                >
                    <Feather name="plus" size={30} color="white" />
                </TouchableOpacity>
            )}

            {/* Upload Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10" style={{ maxHeight: '90%' }}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Upload Record</Text>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                            >
                                <Feather name="x" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* File Picker State */}
                            <TouchableOpacity
                                onPress={handlePickDocument}
                                className={`mb-6 p-6 rounded-3xl border-2 border-dashed items-center justify-center bg-gray-50 ${selectedFile ? 'border-brand-green bg-emerald-50' : 'border-gray-200'}`}
                            >
                                <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-3 ${selectedFile ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Feather name={selectedFile ? "check-circle" : "upload-cloud"} size={28} color={selectedFile ? BRAND_GREEN : "#6B7280"} />
                                </View>
                                <Text className={`font-bold text-base ${selectedFile ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {selectedFile ? selectedFile.name : 'Select Medical Document'}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">PDF, JPEG, or PNG up to 10MB</Text>
                            </TouchableOpacity>

                            <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Title</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-medium mb-4"
                                placeholder="E.g., Dr. Sharma Prescription"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor="#9CA3AF"
                            />

                            <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Category</Text>
                            <View className="flex-row flex-wrap mb-4">
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setCategory(cat)}
                                        className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${category === cat ? 'bg-brand-green border-brand-green' : 'bg-white border-gray-200'}`}
                                        style={category === cat ? { backgroundColor: BRAND_GREEN } : {}}
                                    >
                                        <Text className={`text-xs font-bold ${category === cat ? 'text-white' : 'text-gray-500'}`}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Description (Optional)</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-medium mb-8"
                                placeholder="Add some notes about this record..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                placeholderTextColor="#9CA3AF"
                            />

                            <TouchableOpacity
                                onPress={handleUpload}
                                disabled={isUploading || !selectedFile || !title}
                                className={`py-4 rounded-2xl items-center justify-center shadow-lg ${isUploading || !selectedFile || !title ? 'bg-gray-300' : 'bg-brand-green'}`}
                                style={!(isUploading || !selectedFile || !title) ? { backgroundColor: BRAND_GREEN } : {}}
                            >
                                {isUploading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Save Record</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HealthRecordsScreen;
