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
    }
}

interface AudioFingerprintData {
    values: number[];
}

export function useFingerprintCollectors() {
    const generateCanvasFingerprint = (): string | null => {
        if (!process.client) return null;

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

    const createAudioVisualization = (audioData: number[]): string => {
        if (!process.client) return '';

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Set canvas dimensions
        canvas.width = 300;
        canvas.height = 100;

        // Style configuration
        const styles = {
            backgroundColor: '#1e293b', // dark:bg-slate-800
            waveColor: '#3b82f6', // text-blue-500
            waveWidth: 2,
            padding: 10
        };

        // Clear canvas
        ctx.fillStyle = styles.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = styles.waveColor;
        ctx.lineWidth = styles.waveWidth;

        const width = canvas.width - (styles.padding * 2);
        const height = canvas.height - (styles.padding * 2);
        const step = width / (audioData.length - 1);

        audioData.forEach((value, index) => {
            const x = styles.padding + (index * step);
            const y = styles.padding + (height / 2) + (value * height / 2);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Add grid lines
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'; // slate-400 with low opacity
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let i = 0; i <= width; i += width / 10) {
            ctx.beginPath();
            ctx.moveTo(styles.padding + i, styles.padding);
            ctx.lineTo(styles.padding + i, canvas.height - styles.padding);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let i = 0; i <= height; i += height / 4) {
            ctx.beginPath();
            ctx.moveTo(styles.padding, styles.padding + i);
            ctx.lineTo(canvas.width - styles.padding, styles.padding + i);
            ctx.stroke();
        }

        return canvas.toDataURL();
    };

    const getAudioFingerprint = async (): Promise<AudioFingerprintData | null> => {
        if (!process.client) return null;

        try {
            if (!document.body.hasAttribute('data-user-interacted')) {
                return null;
            }

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            gainNode.gain.value = 0;
            oscillator.type = 'triangle';
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(0);

            return new Promise((resolve) => {
                const audioData: number[] = [];
                scriptProcessor.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    if (audioData.length < 50) {
                        audioData.push(...inputData.slice(0, 50 - audioData.length));
                    }
                    if (audioData.length >= 50) {
                        oscillator.stop();
                        audioContext.close();
                        resolve({
                            values: audioData.slice(0, 50)
                        });
                    }
                };
            });
        } catch (error) {
            console.error('Error generating audio fingerprint:', error);
            return null;
        }
    };

    const getFonts = (): FontDetectionResult => {
        if (!process.client) return { fonts: [], total: 0 };

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
        if (!process.client) {
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

    return {
        generateCanvasFingerprint,
        getAudioFingerprint,
        getFonts,
        getWebGLFingerprint
    };
} 