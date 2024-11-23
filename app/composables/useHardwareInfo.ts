export function useHardwareInfo() {
    const getHardwareAcceleration = () => {
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
        getHardwareAcceleration,
        getTouchSupport,
        getColorDepth
    };
} 