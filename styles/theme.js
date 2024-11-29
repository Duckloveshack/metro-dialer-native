/**
 * @typedef {Object} ThemeColors
 * @property {string} background
 * @property {string} foreground
 * @property {string} active
 * @property {string} inactive
 * @property {string} description
 * @property {string} menu
 */

const lightTheme = {
    background: "#ffffff", 
    foreground: "#000000",
    active: "#000000",
    inactive: "#cccccc",
    description: "#4f4f4f",
    menu: "#dddddd"
};

const darkTheme = {
    background: "#000000",
    foreground: "#ffffff",
    active: "#ffffff",
    inactive: "#333333",
    description: "#b0b0b0",
    menu: "#222222",
}


/**
 * Returns the theme colors
 * @returns {ThemeColors}
 */
const getTheme = () => {
    if (false) {
        return darkTheme
    } else {
        return lightTheme
    }
}

export const MetroTheme = getTheme();