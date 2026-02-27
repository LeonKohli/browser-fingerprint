export function useWebGLFingerprint() {
    const isWebGLSupported = useSupported(() => {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    })

    const getShaderPrecision = (gl: WebGLRenderingContext) => {
        const shaderTypes = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER] as const
        const precisionTypes = [gl.LOW_FLOAT, gl.MEDIUM_FLOAT, gl.HIGH_FLOAT, gl.LOW_INT, gl.MEDIUM_INT, gl.HIGH_INT] as const
        const labels = ['lowFloat', 'mediumFloat', 'highFloat', 'lowInt', 'mediumInt', 'highInt'] as const

        const result: Record<string, Record<string, number[]>> = {
            vertex: {},
            fragment: {},
        }

        for (const [si, shaderType] of shaderTypes.entries()) {
            const key = si === 0 ? 'vertex' : 'fragment'
            for (const [pi, precisionType] of precisionTypes.entries()) {
                const format = gl.getShaderPrecisionFormat(shaderType, precisionType)
                if (format) {
                    result[key][labels[pi]] = [format.rangeMin, format.rangeMax, format.precision]
                }
            }
        }

        return result
    }

    const getWebGLFingerprint = () => {
        if (!import.meta.client || !isWebGLSupported.value) {
            return {
                error: 'WebGL not supported',
                renderer: null,
                vendor: null
            }
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
                    vendor: glContext.getParameter(glContext.VENDOR),
                    version: glContext.getParameter(glContext.VERSION),
                    shadingLanguageVersion: glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION),
                    extensions: glContext.getSupportedExtensions(),
                    contextAttributes: glContext.getContextAttributes(),
                    parameters: {
                        maxTextureSize: glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
                        maxViewportDims: glContext.getParameter(glContext.MAX_VIEWPORT_DIMS),
                        maxRenderbufferSize: glContext.getParameter(glContext.MAX_RENDERBUFFER_SIZE),
                    },
                    shaderPrecision: getShaderPrecision(glContext),
                };
            }

            return {
                renderer: glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                vendor: glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                version: glContext.getParameter(glContext.VERSION),
                shadingLanguageVersion: glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION),
                extensions: glContext.getSupportedExtensions(),
                contextAttributes: glContext.getContextAttributes(),
                parameters: {
                    maxTextureSize: glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
                    maxViewportDims: glContext.getParameter(glContext.MAX_VIEWPORT_DIMS),
                    maxRenderbufferSize: glContext.getParameter(glContext.MAX_RENDERBUFFER_SIZE),
                    maxCubeMapTextureSize: glContext.getParameter(glContext.MAX_CUBE_MAP_TEXTURE_SIZE),
                    maxTextureImageUnits: glContext.getParameter(glContext.MAX_TEXTURE_IMAGE_UNITS),
                    maxVertexTextureImageUnits: glContext.getParameter(glContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                    maxCombinedTextureImageUnits: glContext.getParameter(glContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
                    aliasedLineWidthRange: glContext.getParameter(glContext.ALIASED_LINE_WIDTH_RANGE),
                    aliasedPointSizeRange: glContext.getParameter(glContext.ALIASED_POINT_SIZE_RANGE),
                    maxVertexAttribs: glContext.getParameter(glContext.MAX_VERTEX_ATTRIBS),
                    maxVaryingVectors: glContext.getParameter(glContext.MAX_VARYING_VECTORS),
                    maxVertexUniformVectors: glContext.getParameter(glContext.MAX_VERTEX_UNIFORM_VECTORS),
                    maxFragmentUniformVectors: glContext.getParameter(glContext.MAX_FRAGMENT_UNIFORM_VECTORS),
                    subpixelBits: glContext.getParameter(glContext.SUBPIXEL_BITS),
                    redBits: glContext.getParameter(glContext.RED_BITS),
                    greenBits: glContext.getParameter(glContext.GREEN_BITS),
                    blueBits: glContext.getParameter(glContext.BLUE_BITS),
                    alphaBits: glContext.getParameter(glContext.ALPHA_BITS),
                    depthBits: glContext.getParameter(glContext.DEPTH_BITS),
                    stencilBits: glContext.getParameter(glContext.STENCIL_BITS),
                },
                shaderPrecision: getShaderPrecision(glContext),
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
        getWebGLFingerprint,
        isWebGLSupported
    };
} 