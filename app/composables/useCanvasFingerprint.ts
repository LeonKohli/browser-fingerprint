export function useCanvasFingerprint() {
    const generateCanvasFingerprint = (): string | null => {
        if (!import.meta.client) return null;

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return null;
            }

            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Browser Fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Canvas Test', 4, 45);

            ctx.strokeStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.beginPath();
            ctx.arc(50, 50, 30, 0, Math.PI * 2);
            ctx.stroke();

            return canvas.toDataURL();
        } catch (error) {
            console.error('Error generating canvas fingerprint:', error);
            return null;
        }
    };

    return {
        generateCanvasFingerprint
    };
} 