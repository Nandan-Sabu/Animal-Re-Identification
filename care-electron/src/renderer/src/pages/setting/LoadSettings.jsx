/** @format */

import './settings.css';
import { Heading } from "../../components/Heading";
import { useEffect, useState } from 'react';

export default function Settings() {

    // useState hooks to track state of textSize
    const [textSize, setTextSize] = useState(() => {
        // Get initial text size from localStorage otherwise default to Medium
        return localStorage.getItem('textSize') || 'Medium';
    });

    // useEffect hooks to set text size changes constants
    useEffect(() => {
    const scales = {
        'Small': 0.9,
        'Medium': 1,
        'Large': 1.1
    };

    // Sets the global --text-scale property
    document.documentElement.style.setProperty('--text-scale', scales[textSize]);

    // Save to localStorage
    localStorage.setItem('textSize', textSize);
}, [textSize]);

    // Changes textSize when applicable button is clicked
    const handleTextSizeChange = (size) => {
        setTextSize(size); // triggers useEffect, which updates --text-scale
    };


    // useState hooks to track state of light/dark mode
    const [darkMode, toggleDarkMode] = useState(() => {
        // Get initial light/dark mode state from localStorage otherwise default to lighMode
        return localStorage.getItem('darkMode') === 'true' || false;
    });

    // useEffect hooks to set light/dark mode constraints
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.setAttribute('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.setAttribute('theme', 'light');
        }
        
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);


    // Changes to light/dark mode when applicable toggle switch is clicked
    const handleDarkModeToggle = () => {
        toggleDarkMode(!darkMode);
    };




    return null;

}