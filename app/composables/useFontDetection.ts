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
            
            // Popular Web Fonts
            'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
            'Raleway', 'PT Sans', 'Noto Sans', 'Ubuntu', 'Nunito',
            'Playfair Display', 'Poppins', 'Merriweather', 'Oswald',
            'Quicksand', 'Dancing Script', 'Pacifico'
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
                context.font = `${testSize} "${font}", ${baseFont}`;
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

    return {
        getFonts
    };
} 