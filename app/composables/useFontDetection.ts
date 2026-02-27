export function useFontDetection() {
    const getFonts = () => {
        if (!import.meta.client) return { fonts: [], total: 0 };

        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const fontList = [
            // Common Windows Fonts
            'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Cambria',
            'Cambria Math', 'Comic Sans MS', 'Courier', 'Courier New',
            'Georgia', 'Helvetica', 'Impact', 'Times', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Segoe UI', 'Tahoma', 'Consolas',
            'Lucida Console', 'MS Gothic', 'MS PGothic', 'MS Sans Serif',
            'MS Serif', 'Palatino Linotype', 'Book Antiqua',
            
            // Common Mac Fonts
            'American Typewriter', 'Andale Mono', 'Apple Chancery',
            'Apple Color Emoji', 'Apple SD Gothic Neo', 'AppleGothic',
            'Avenir', 'Avenir Next', 'Baskerville', 'Big Caslon',
            'Brush Script MT', 'Chalkboard', 'Cochin', 'Copperplate',
            'Didot', 'Futura', 'Geneva', 'Gill Sans', 'Helvetica Neue',
            'Herculanum', 'Hoefler Text', 'Lucida Grande', 'Luminari',
            'Marker Felt', 'Menlo', 'Monaco', 'Noteworthy', 'Optima',
            'Papyrus', 'Phosphate', 'Rockwell', 'Skia', 'Snell Roundhand',
            'Zapfino',

            // Common Linux Fonts
            'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Liberation Mono',
            'Liberation Sans', 'Liberation Serif', 'Ubuntu', 'Ubuntu Mono',
            'Noto Sans', 'Noto Serif', 'Droid Sans', 'Droid Serif',
            'FreeMono', 'FreeSans', 'FreeSerif', 'Nimbus Roman', 'Nimbus Sans',
        ];

        // Uses wide chars (m/M/W), narrow chars (l/i/I), distinctive shapes (0/O/&/1)
        const testString = 'mmMwWLliI0O&1';
        const testSize = '48px';
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            return { fonts: [], total: 0 };
        }

        // Compute baselines ONCE (not per font)
        const baseWidth: Record<string, number> = {};
        const baseHeight: Record<string, number> = {};
        baseFonts.forEach(baseFont => {
            context.font = `${testSize} ${baseFont}`;
            const metrics = context.measureText(testString);
            baseWidth[baseFont] = metrics.width;
            // Use actualBoundingBoxAscent + actualBoundingBoxDescent for height
            baseHeight[baseFont] = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        });

        const detectFont = (font: string): boolean => {
            for (const baseFont of baseFonts) {
                context.font = `${testSize} "${font}", ${baseFont}`;
                const metrics = context.measureText(testString);
                const width = metrics.width;
                const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                // Check both width AND height differences
                if (width !== baseWidth[baseFont] || height !== baseHeight[baseFont]) {
                    return true;
                }
            }
            return false;
        };

        const detectedFonts = fontList.filter(font => detectFont(font));

        return {
            fonts: detectedFonts,
            total: detectedFonts.length
        };
    };

    return {
        getFonts
    };
} 