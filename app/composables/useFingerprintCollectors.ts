interface FontDetectionResult {
    fonts: string[];
    total: number;
}

interface WebGLInfo {
    renderer?: string | null;
    vendor?: string | null;
    error?: string;
    extensions?: string[];
    parameters?: {
        maxTextureSize: number;
        maxViewportDims: number | null;
        maxRenderbufferSize: number;
        aliasedLineWidthRange: Float32Array;
        aliasedPointSizeRange: Float32Array;
        maxVertexAttribs: number;
        maxVaryingVectors: number;
        maxVertexUniformVectors: number;
        maxFragmentUniformVectors: number;
    };
}

// Add WebGL type declarations
interface WebGLRenderingContext {
    RENDERER: number;
    VENDOR: number;
    MAX_TEXTURE_SIZE: number;
    MAX_VIEWPORT_DIMS: number;
    MAX_RENDERBUFFER_SIZE: number;
    ALIASED_LINE_WIDTH_RANGE: number;
    ALIASED_POINT_SIZE_RANGE: number;
    MAX_VERTEX_ATTRIBS: number;
    MAX_VARYING_VECTORS: number;
    MAX_VERTEX_UNIFORM_VECTORS: number;
    MAX_FRAGMENT_UNIFORM_VECTORS: number;
    getParameter(pname: number): any;
    getExtension(name: string): any;
    getSupportedExtensions(): string[];
}

// Add AudioContext type declarations
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
        OfflineAudioContext: typeof AudioContext;
        webkitOfflineAudioContext: typeof AudioContext;
    }
}

interface AudioFingerprintData {
    hash: number;
}

interface AudioParam {
    value: number;
}

interface DynamicsCompressorNode extends AudioNode {
    threshold: AudioParam;
    knee: AudioParam;
    ratio: AudioParam;
    reduction: number;
    attack: AudioParam;
    release: AudioParam;
}

interface BatteryInfo {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

interface NetworkInfo {
    downlink: number;
    effectiveType: string;
    rtt: number;
    saveData: boolean;
}

export function useFingerprintCollectors() {
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

    const getAudioFingerprint = async (): Promise<AudioFingerprintData | null> => {
        if (!import.meta.client) return null;

        try {
            // Get appropriate AudioContext constructor
            const AudioContextClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
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
            const compressor = context.createDynamicsCompressor() as DynamicsCompressorNode;
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            // Remove the reduction.value assignment as it's a read-only property
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

    const getFonts = (): FontDetectionResult => {
        if (!import.meta.client) return { fonts: [], total: 0 };

        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const fontList = [
            'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Cambria',
            'Cambria Math', 'Comic Sans MS', 'Courier', 'Courier New',
            'Georgia', 'Helvetica', 'Impact', 'Times', 'Times New Roman',
            'Trebuchet MS', 'Verdana'
        ];

        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            return {
                fonts: [],
                total: 0
            };
        }

        const detectFont = (font: string): boolean => {
            const baseWidth: Record<string, number> = {};
            baseFonts.forEach(baseFont => {
                context.font = `${testSize} ${baseFont}`;
                baseWidth[baseFont] = context.measureText(testString).width;
            });

            let detected = false;
            for (const baseFont of baseFonts) {
                context.font = `${testSize} ${font}, ${baseFont}`;
                const width = context.measureText(testString).width;
                if (width !== baseWidth[baseFont]) {
                    detected = true;
                    break;
                }
            }
            return detected;
        };

        const detectedFonts = fontList.filter(font => detectFont(font));

        return {
            fonts: detectedFonts,
            total: detectedFonts.length
        };
    };

    const getWebGLFingerprint = (): WebGLInfo => {
        if (!import.meta.client) {
            return {
                error: 'Not running in browser context',
                renderer: null,
                vendor: null
            };
        }

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) {
                return {
                    error: 'WebGL not supported',
                    renderer: null,
                    vendor: null
                };
            }

            // Type assertion for WebGL context
            const glContext = gl as WebGLRenderingContext;
            const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');

            if (!debugInfo) {
                return {
                    error: 'WEBGL_debug_renderer_info not supported',
                    renderer: glContext.getParameter(glContext.RENDERER),
                    vendor: glContext.getParameter(glContext.VENDOR)
                };
            }

            return {
                renderer: glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                vendor: glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                extensions: glContext.getSupportedExtensions(),
                parameters: {
                    maxTextureSize: glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
                    maxViewportDims: glContext.getParameter(glContext.MAX_VIEWPORT_DIMS),
                    maxRenderbufferSize: glContext.getParameter(glContext.MAX_RENDERBUFFER_SIZE),
                    aliasedLineWidthRange: glContext.getParameter(glContext.ALIASED_LINE_WIDTH_RANGE),
                    aliasedPointSizeRange: glContext.getParameter(glContext.ALIASED_POINT_SIZE_RANGE),
                    maxVertexAttribs: glContext.getParameter(glContext.MAX_VERTEX_ATTRIBS),
                    maxVaryingVectors: glContext.getParameter(glContext.MAX_VARYING_VECTORS),
                    maxVertexUniformVectors: glContext.getParameter(glContext.MAX_VERTEX_UNIFORM_VECTORS),
                    maxFragmentUniformVectors: glContext.getParameter(glContext.MAX_FRAGMENT_UNIFORM_VECTORS)
                }
            };
        } catch (error) {
            return {
                error: 'Error getting WebGL information',
                renderer: null,
                vendor: null
            };
        }
    };

    const getBatteryInfo = async (): Promise<BatteryInfo | null> => {
        if (!import.meta.client || !('getBattery' in navigator)) return null;
        
        try {
            const battery = await (navigator as any).getBattery();
            return {
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
                level: battery.level
            };
        } catch (error) {
            console.error('Error getting battery info:', error);
            return null;
        }
    };

    const getNetworkInfo = (): NetworkInfo | null => {
        if (!import.meta.client || !('connection' in navigator)) return null;
        
        const connection = (navigator as any).connection;
        return {
            downlink: connection?.downlink,
            effectiveType: connection?.effectiveType,
            rtt: connection?.rtt,
            saveData: connection?.saveData
        };
    };

    const getHardwareAcceleration = (): boolean => {
        if (!import.meta.client) return false;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('webgl');
        if (!ctx) return false;
        
        const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return false;
        
        const renderer = ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return !/SwiftShader|Software|Microsoft Basic Render/i.test(renderer);
    };

    const getTouchSupport = () => {
        if (!import.meta.client) return null;
        
        return {
            maxTouchPoints: navigator.maxTouchPoints,
            touchEvent: 'ontouchstart' in window,
            touchPoints: navigator.maxTouchPoints || 0
        };
    };

    const getColorDepth = () => {
        if (!import.meta.client) return null;
        
        return {
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        };
    };

    return {
        generateCanvasFingerprint,
        getAudioFingerprint,
        getFonts,
        getWebGLFingerprint,
        getBatteryInfo,
        getNetworkInfo,
        getHardwareAcceleration,
        getTouchSupport,
        getColorDepth
    };
}