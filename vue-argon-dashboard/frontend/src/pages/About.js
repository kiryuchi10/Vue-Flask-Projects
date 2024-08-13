import React, { useEffect } from 'react';

const About = ({ setMessage }) => {
    const handleAboutPage = async (e) => {
        if (e) e.preventDefault(); // Prevent default behavior if event is provided
        try {
            const response = await fetch('/about');
            if (response.ok) {
                const data = await response.json();
                setMessage(data);
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    useEffect(() => {
        handleAboutPage(); // Call the function without event when the component mounts
    }, []);

    return (
        <div>
            <h2>About Page</h2>
            <p>Welcome to the About Page!</p>
            {/* Button to fetch data manually */}
            <button onClick={handleAboutPage}>Fetch Data</button>
        </div>
    );
};

export default About;
