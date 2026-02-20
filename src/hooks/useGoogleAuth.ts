import { useState } from 'react';

interface UseGoogleAuthProps {
    role?: string;
    redirectTo?: string;
}

export function useGoogleAuth({ role = 'patient', redirectTo = '/me' }: UseGoogleAuthProps = {}) {
    const [isLoading, setIsLoading] = useState(false);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        console.log(`Signing in with Google as ${role}, redirecting to ${redirectTo}`);
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                resolve(true);
            }, 1500);
        });
    };

    return {
        signInWithGoogle,
        isLoading,
    };
}
