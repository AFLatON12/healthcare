import React, { useState } from 'react';
import '../styles/Prescriptions.css';

const Prescriptions = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [isNewPrescriptionModalOpen, setIsNewPrescriptionModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    // Mock data for demonstration
    const activePrescriptions = [
        {
            id: 1,
            doctorName: 'Dr. Sarah Wilson',
            date: '2024-03-15',
            medications: [
                {
                    name: 'Amoxicillin',
                    dosage: '500mg',
                    frequency: '3 times daily',
                    duration: '7 days',
                    instructions: 'Take after meals'
                },
                {
                    name: 'Ibuprofen',
                    dosage: '400mg',
                    frequency: 'As needed',
                    duration: '5 days',
                    instructions: 'Take with food'
                }
            ],
            notes: 'Complete the full course of antibiotics even if symptoms improve.'
        },
        {
            id: 2,
            doctorName: 'Dr. Michael Brown',
            date: '2024-03-10',
            medications: [
                {
                    name: 'Paracetamol',
                    dosage: '650mg',
                    frequency: 'Every 6 hours',
                    duration: '3 days',
                    instructions: 'Take for fever or pain'
                }
            ],
            notes: 'Stay hydrated and rest well.'
        }
    ];

    const pastPrescriptions = [
        {
            id: 3,
            doctorName: 'Dr. Emily Davis',
            date: '2024-02-20',
            medications: [
                {
                    name: 'Cetirizine',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '14 days',
                    instructions: 'Take at night'
                }
            ],
            notes: 'For seasonal allergies'
        }
    ];

    const handleNewPrescription = (e) => {
        e.preventDefault();
        // TODO: Implement new prescription logic
        console.log('Creating new prescription');
        setIsNewPrescriptionModalOpen(false);
    };

    return (
        <div className="prescriptions-page">
            <div className="prescriptions-header">
                <h1>Prescriptions</h1>
                <button
                    className="new-prescription-btn"
                    onClick={() => setIsNewPrescriptionModalOpen(true)}
                >
                    New Prescription
                </button>
            </div>

            <div className="prescriptions-tabs">
                <button
                    className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active
                </button>
                <button
                    className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past
                </button>
            </div>

            <div className="prescriptions-list">
                {(activeTab === 'active' ? activePrescriptions : pastPrescriptions).map(prescription => (
                    <div
                        key={prescription.id}
                        className="prescription-card"
                        onClick={() => setSelectedPrescription(prescription)}
                    >
                        <div className="prescription-header">
                            <div className="prescription-info">
                                <h3>{prescription.doctorName}</h3>
                                <p className="prescription-date">Prescribed on {prescription.date}</p>
                            </div>
                            <button className="view-details-btn">View Details</button>
                        </div>
                        <div className="medications-preview">
                            {prescription.medications.map((med, index) => (
                                <span key={index} className="medication-tag">
                                    {med.name} ({med.dosage})
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedPrescription && (
                <div className="modal-overlay">
                    <div className="prescription-modal">
                        <div className="modal-header">
                            <h2>Prescription Details</h2>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedPrescription(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="prescription-details">
                            <div className="detail-row">
                                <span className="label">Doctor:</span>
                                <span className="value">{selectedPrescription.doctorName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Date:</span>
                                <span className="value">{selectedPrescription.date}</span>
                            </div>
                            <div className="medications-list">
                                <h3>Medications</h3>
                                {selectedPrescription.medications.map((med, index) => (
                                    <div key={index} className="medication-item">
                                        <h4>{med.name}</h4>
                                        <div className="medication-details">
                                            <p><strong>Dosage:</strong> {med.dosage}</p>
                                            <p><strong>Frequency:</strong> {med.frequency}</p>
                                            <p><strong>Duration:</strong> {med.duration}</p>
                                            <p><strong>Instructions:</strong> {med.instructions}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedPrescription.notes && (
                                <div className="prescription-notes">
                                    <h3>Notes</h3>
                                    <p>{selectedPrescription.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="print-btn">Print Prescription</button>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedPrescription(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isNewPrescriptionModalOpen && (
                <div className="modal-overlay">
                    <div className="prescription-modal">
                        <div className="modal-header">
                            <h2>New Prescription</h2>
                            <button
                                className="close-btn"
                                onClick={() => setIsNewPrescriptionModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleNewPrescription}>
                            <div className="form-group">
                                <label htmlFor="patient">Select Patient</label>
                                <select id="patient" required>
                                    <option value="">Choose a patient</option>
                                    <option value="1">John Doe</option>
                                    <option value="2">Jane Smith</option>
                                </select>
                            </div>

                            <div className="medications-section">
                                <h3>Medications</h3>
                                <div className="medication-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="medication">Medication Name</label>
                                            <input type="text" id="medication" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dosage">Dosage</label>
                                            <input type="text" id="dosage" required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="frequency">Frequency</label>
                                            <input type="text" id="frequency" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="duration">Duration</label>
                                            <input type="text" id="duration" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="instructions">Instructions</label>
                                        <textarea id="instructions" rows="2" required></textarea>
                                    </div>
                                </div>
                                <button type="button" className="add-medication-btn">
                                    + Add Another Medication
                                </button>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes</label>
                                <textarea id="notes" rows="3"></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsNewPrescriptionModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Prescription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions; 