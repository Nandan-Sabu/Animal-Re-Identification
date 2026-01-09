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




    return (
        <section className="settings-main">

            {/* Green settings container */}
            <div className="settings-container">
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Heading */}
                <Heading className="settings-h1" level={1}>
                    Settings
                </Heading>

                {/* Body consisting of all the settings options */}
                <div className="settings-body">

                    {/* Toggle switch */}
                    <div className="setting-row">
                        <p className="label-text"> Dark Mode </p>
                        <label className="toggle-switch">
                            <input 
                                type="checkbox"
                                checked={darkMode}
                                onChange={handleDarkModeToggle}
                            />
                            <span className="slider"/>
                        </label>
                    </div>


                    {/* Radio Button Group */}
                    <div className="setting-row">
                        <div className="radio-button-group">
                            <p className="label-text"> Text Size </p>

                            <div className="button-with-label">
                                <input 
                                    type="radio" 
                                    id="size-small" 
                                    name="text-size" 
                                    value="Small"
                                    checked={textSize === 'Small'}
                                    onChange={() => handleTextSizeChange('Small')}
                                />
                                <label className="radio-button">
                                    <span className="radio-circle"></span>
                                </label>
                                <p className="small-label-text"> Small </p>
                            </div>

                            <div className="button-with-label">
                                <input 
                                    type="radio" 
                                    id="size-medium" 
                                    name="text-size" 
                                    value="Medium" 
                                    checked={textSize === 'Medium'}
                                    onChange={() => handleTextSizeChange('Medium')}                                  
                                />
                                <label className="radio-button">
                                    <span className="radio-circle"></span>
                                </label>
                                <p className="small-label-text"> Medium </p>
                            </div>

                            <div className="button-with-label">
                                <input 
                                    type="radio" 
                                    id="size-large" 
                                    name="text-size" 
                                    value="Large"
                                    checked={textSize === 'Large'}
                                    onChange={() => handleTextSizeChange('Large')}
                                />
                                <label className="radio-button">
                                    <span className="radio-circle"></span>
                                </label>
                                <p className="small-label-text"> Large </p>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </section>
    );

}