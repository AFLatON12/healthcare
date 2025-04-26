import React, { useState } from 'react';
import '../styles/Messages.css';

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    // Mock data for demonstration
    const conversations = [
        {
            id: 1,
            name: 'Dr. Sarah Wilson',
            lastMessage: 'Regarding your test results...',
            time: '2 hours ago',
            unread: true,
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 2,
            name: 'Dr. Michael Brown',
            lastMessage: 'Can we reschedule your appointment?',
            time: '5 hours ago',
            unread: false,
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 3,
            name: 'Dr. Emily Davis',
            lastMessage: 'Your prescription is ready',
            time: '1 day ago',
            unread: false,
            avatar: 'https://via.placeholder.com/50'
        }
    ];

    const messages = {
        1: [
            {
                id: 1,
                sender: 'Dr. Sarah Wilson',
                content: 'Hello, I have your test results ready.',
                time: '10:00 AM',
                isDoctor: true
            },
            {
                id: 2,
                sender: 'You',
                content: 'Great, what do they show?',
                time: '10:05 AM',
                isDoctor: false
            },
            {
                id: 3,
                sender: 'Dr. Sarah Wilson',
                content: 'Regarding your test results...',
                time: '10:10 AM',
                isDoctor: true
            }
        ]
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // TODO: Implement message sending logic
        console.log('Sending message:', newMessage);
        setNewMessage('');
    };

    return (
        <div className="messages-page">
            <div className="messages-container">
                <div className="conversations-list">
                    <div className="conversations-header">
                        <h2>Messages</h2>
                        <div className="search-box">
                            <input type="text" placeholder="Search conversations..." />
                        </div>
                    </div>

                    <div className="conversations">
                        {conversations.map(conversation => (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${selectedChat === conversation.id ? 'active' : ''}`}
                                onClick={() => setSelectedChat(conversation.id)}
                            >
                                <img src={conversation.avatar} alt={conversation.name} className="avatar" />
                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <h3>{conversation.name}</h3>
                                        <span className="time">{conversation.time}</span>
                                    </div>
                                    <p className="last-message">{conversation.lastMessage}</p>
                                </div>
                                {conversation.unread && <div className="unread-badge" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-container">
                    {selectedChat ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <img src={conversations.find(c => c.id === selectedChat)?.avatar} alt="Doctor" className="avatar" />
                                    <h3>{conversations.find(c => c.id === selectedChat)?.name}</h3>
                                </div>
                                <div className="chat-actions">
                                    <button className="action-btn">Call</button>
                                    <button className="action-btn">Video</button>
                                </div>
                            </div>

                            <div className="messages-list">
                                {messages[selectedChat]?.map(message => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.isDoctor ? 'received' : 'sent'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.content}</p>
                                            <span className="message-time">{message.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form className="message-input" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="send-btn">
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h3>Select a conversation to start messaging</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages; 