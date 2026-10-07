import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import { AlertCircle, Check, LucideIcon } from 'lucide-react-native';
import { cn } from '../../lib/utils';

type AuthTextFieldProps = TextInputProps & {
    label: string;
    icon?: LucideIcon;
    error?: string;
    right?: React.ReactNode;
    focused?: boolean;
    touched?: boolean;
    helperText?: string;
    containerClassName?: string;
};

export function AuthTextField({
    label,
    icon: Icon,
    error,
    right,
    focused,
    touched,
    helperText,
    containerClassName,
    className,
    ...inputProps
}: AuthTextFieldProps) {
    const showError = Boolean(touched && error);

    return (
        <View className={containerClassName}>
            {label ? <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">{label}</Text> : null}
            <View
                className={cn(
                    'flex-row items-center min-h-14 bg-white dark:bg-slate-900 border-[1.5px] rounded-2xl px-4',
                    showError
                        ? 'border-rose-400'
                        : focused
                            ? 'border-primary'
                            : 'border-slate-200 dark:border-slate-800'
                )}
            >
                {Icon && (
                    <View className="mr-3">
                        <Icon size={20} color={showError ? '#FB7185' : focused ? '#10B981' : '#94A3B8'} />
                    </View>
                )}
                <TextInput
                    placeholderTextColor="#94A3B8"
                    className={cn('flex-1 text-base text-slate-900 dark:text-white py-0', className)}
                    {...inputProps}
                />
                {right}
            </View>
            {(showError || helperText) && (
                <View className="flex-row items-start mt-1.5">
                    {showError && <AlertCircle size={14} color="#FB7185" />}
                    <Text
                        className={cn(
                            'flex-1 text-[12px] leading-4',
                            showError ? 'text-rose-500 ml-1.5' : 'text-slate-500 dark:text-slate-400'
                        )}
                    >
                        {showError ? error : helperText}
                    </Text>
                </View>
            )}
        </View>
    );
}

type AuthPrimaryButtonProps = {
    label: string;
    loadingLabel?: string;
    isLoading?: boolean;
    disabled?: boolean;
    onPress: () => void;
    icon?: React.ReactNode;
    className?: string;
};

export function AuthPrimaryButton({
    label,
    loadingLabel,
    isLoading,
    disabled,
    onPress,
    icon,
    className,
}: AuthPrimaryButtonProps) {
    const isDisabled = Boolean(disabled || isLoading);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            disabled={isDisabled}
            className={cn(
                'h-14 rounded-2xl items-center justify-center shadow-lg flex-row',
                isDisabled ? 'bg-slate-200 dark:bg-slate-800 shadow-transparent' : 'bg-primary shadow-primary/20',
                className
            )}
        >
            {isLoading ? (
                <>
                    <ActivityIndicator color="white" size="small" />
                    {loadingLabel && <Text className="text-white text-base font-bold ml-2">{loadingLabel}</Text>}
                </>
            ) : (
                <>
                    <Text className={cn('text-lg font-bold', isDisabled ? 'text-slate-400 dark:text-slate-500' : 'text-white')}>
                        {label}
                    </Text>
                    {icon && <View className="ml-2">{icon}</View>}
                </>
            )}
        </TouchableOpacity>
    );
}

type AuthNoticeProps = {
    icon: LucideIcon;
    text: string;
};

export function AuthNotice({ icon: Icon, text }: AuthNoticeProps) {
    return (
        <View className="flex-row bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl items-start border border-emerald-100 dark:border-emerald-900/60">
            <Icon size={20} color="#10B981" />
            <Text className="flex-1 text-[13px] text-emerald-800 dark:text-emerald-300 ml-3 leading-5">
                {text}
            </Text>
        </View>
    );
}

type AuthCheckboxProps = {
    checked: boolean;
    onPress: () => void;
    children: React.ReactNode;
    disabled?: boolean;
};

export function AuthCheckbox({ checked, onPress, children, disabled }: AuthCheckboxProps) {
    return (
        <TouchableOpacity
            className="flex-row items-start"
            onPress={onPress}
            activeOpacity={0.75}
            disabled={disabled}
        >
            <View
                className={cn(
                    'w-5 h-5 rounded-md border-[1.5px] items-center justify-center mr-2.5 mt-0.5',
                    checked ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-700'
                )}
            >
                {checked && <Check size={14} color="#FFFFFF" />}
            </View>
            <Text className="flex-1 text-[13px] text-slate-500 dark:text-slate-400 leading-5">
                {children}
            </Text>
        </TouchableOpacity>
    );
}
