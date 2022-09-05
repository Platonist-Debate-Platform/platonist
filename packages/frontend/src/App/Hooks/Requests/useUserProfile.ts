import { useConfig } from '@platonist/library';
import React from 'react';

export const useUserProfile = (username: string) => {
    const config = useConfig();
    const url = config.createApiUrl(config.api.config);

    
}