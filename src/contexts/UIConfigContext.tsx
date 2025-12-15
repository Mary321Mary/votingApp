import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchUIConfiguration } from 'utils/api';
import { UIConfig } from 'utils/types';

interface UIConfigContextType {
    config: UIConfig | null;
    isLoading: boolean;
    error: string | null;
}

const UIConfigContext = createContext<UIConfigContextType | undefined>(undefined);

export const UIConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<UIConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const response = await fetchUIConfiguration();
                setConfig(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch UI configuration:', err);
                setError('Failed to load configuration');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <UIConfigContext.Provider value={{ config, isLoading, error }}>
            {children}
        </UIConfigContext.Provider>
    );
};

export const useUIConfig = () => {
    const context = useContext(UIConfigContext);
    if (context === undefined) {
        throw new Error('useUIConfig must be used within a UIConfigProvider');
    }
    return context;
};