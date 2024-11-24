interface AudioFingerprintData {
    hash: number;
}

export function useAudioFingerprint() {
    const isSupported = useSupported(() => window.OfflineAudioContext !== undefined)

    const getAudioFingerprint = async (): Promise<AudioFingerprintData | null> => {
        if (!isSupported.value) return null;

        try {
            // Get appropriate AudioContext constructor
            const AudioContextClass = window.OfflineAudioContext;
            if (!AudioContextClass) {
                return null;
            }

            // Create audio context
            const context = new AudioContextClass(1, 5000, 44100);

            // Create oscillator
            const oscillator = context.createOscillator();
            oscillator.type = "triangle";
            oscillator.frequency.value = 1000;

            // Create compressor
            const compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.2;

            // Connect nodes
            oscillator.connect(compressor);
            compressor.connect(context.destination);

            // Start oscillator
            oscillator.start();

            // Render audio and calculate hash
            const buffer = await new Promise<AudioBuffer>((resolve) => {
                context.oncomplete = (event) => resolve(event.renderedBuffer);
                context.startRendering();
            });

            // Get samples and calculate hash
            const samples = buffer.getChannelData(0);
            let hash = 0;
            for (let i = 0; i < samples.length; ++i) {
                const sample = samples[i];
                if (typeof sample === 'number') {
                    hash += Math.abs(sample);
                }
            }

            return { hash };

        } catch (error) {
            console.error('Error generating audio fingerprint:', error);
            return null;
        }
    };

    return {
        getAudioFingerprint,
        isSupported
    };
} 