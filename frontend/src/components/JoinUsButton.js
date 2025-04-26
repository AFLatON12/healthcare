import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinUsButton.css';

const JoinUsButton = () => {
    const navigate = useNavigate();

    const handleJoinUs = () => {
        navigate('/join-us');
    };

    return (
        <div className="join-us-container">
            <button className="join-us-button" onClick={handleJoinUs}>
                Join Our Medical Team
            </button>
        </div>
    );
};

export default JoinUsButton; 