export function useWebGLFingerprint() {
    const getWebGLFingerprint = () => {
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
        getWebGLFingerprint
    };
} 