export function useFingerprintHelpers() {
    const formatKey = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    const copyFingerprint = async (hash: string | undefined): Promise<void> => {
        if (!process.client || !hash) return;

        try {
            await navigator.clipboard.writeText(hash);
            // Handle success (e.g., show a notification)
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const getSectionDescription = (sectionId: string): string => {
        const descriptions: Record<string, string> = {
            browser: 'Information about your web browser and its capabilities',
            system: 'Details about your operating system and environment',
            screen: 'Display and resolution information',
            media: 'Audio and visual capabilities',
            hardware: 'Device hardware specifications',
            webgl: 'Graphics and rendering capabilities'
        };
        return descriptions[sectionId] || '';
    };

    return {
        formatKey,
        copyFingerprint,
        getSectionDescription
    };
} 