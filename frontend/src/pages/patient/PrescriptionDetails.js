import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/PrescriptionDetails.css';

const PrescriptionDetails = () => {
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: Fetch prescription details from API
        // For now, using mock data
        const mockPrescription = {
            id: id,
            doctorName: 'Dr. Sarah Wilson',
            doctorSpecialty: 'Cardiologist',
            dateIssued: '2024-03-20',
            validUntil: '2024-04-20',
            status: 'active',
            diagnosis: 'Hypertension',
            medications: [
                {
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take in the morning with water',
                    sideEffects: 'May cause dizziness, dry cough',
                    quantity: '30 tablets',
                    refills: 2
                },
                {
                    name: 'Aspirin',
                    dosage: '81mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take with food',
                    sideEffects: 'May cause stomach upset',
                    quantity: '30 tablets',
                    refills: 2
                }
            ],
            additionalNotes: 'Monitor blood pressure daily. Report any unusual symptoms.',
            pharmacy: {
                name: 'City Pharmacy',
                address: '123 Health Street, Medical District',
                phone: '(555) 123-4567',
                hours: 'Mon-Sat: 8AM-10PM, Sun: 9AM-6PM'
            },
            insuranceInfo: {
                provider: 'HealthCare Plus',
                policyNumber: 'HC123456789',
                coverage: '80%',
                copay: '$10'
            }
        };

        setTimeout(() => {
            setPrescription(mockPrescription);
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading prescription details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link to="/patient/dashboard" className="back-link">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="prescription-details-container">
            <div className="prescription-details-header">
                <Link to="/patient/dashboard" className="back-button">
                    ← Back to Dashboard
                </Link>
                <h1>Prescription Details</h1>
                <span className={`status-badge status-${prescription.status}`}>
                    {prescription.status}
                </span>
            </div>

            <div className="prescription-details-content">
                <div className="prescription-main-info">
                    <div className="info-section">
                        <h2>Doctor Information</h2>
                        <p><strong>Name:</strong> {prescription.doctorName}</p>
                        <p><strong>Specialty:</strong> {prescription.doctorSpecialty}</p>
                    </div>

                    <div className="info-section">
                        <h2>Prescription Information</h2>
                        <p><strong>Date Issued:</strong> {prescription.dateIssued}</p>
                        <p><strong>Valid Until:</strong> {prescription.validUntil}</p>
                        <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                    </div>
                </div>

                <div className="medications-section">
                    <h2>Medications</h2>
                    {prescription.medications.map((medication, index) => (
                        <div key={index} className="medication-card">
                            <div className="medication-header">
                                <h3>{medication.name}</h3>
                                <span className="dosage">{medication.dosage}</span>
                            </div>
                            <div className="medication-details">
                                <p><strong>Frequency:</strong> {medication.frequency}</p>
                                <p><strong>Duration:</strong> {medication.duration}</p>
                                <p><strong>Quantity:</strong> {medication.quantity}</p>
                                <p><strong>Refills Remaining:</strong> {medication.refills}</p>
                                <p><strong>Instructions:</strong> {medication.instructions}</p>
                                <p><strong>Side Effects:</strong> {medication.sideEffects}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="additional-info">
                    <div className="info-card">
                        <h2>Pharmacy Information</h2>
                        <p><strong>Name:</strong> {prescription.pharmacy.name}</p>
                        <p><strong>Address:</strong> {prescription.pharmacy.address}</p>
                        <p><strong>Phone:</strong> {prescription.pharmacy.phone}</p>
                        <p><strong>Hours:</strong> {prescription.pharmacy.hours}</p>
                    </div>

                    <div className="info-card">
                        <h2>Insurance Information</h2>
                        <p><strong>Provider:</strong> {prescription.insuranceInfo.provider}</p>
                        <p><strong>Policy Number:</strong> {prescription.insuranceInfo.policyNumber}</p>
                        <p><strong>Coverage:</strong> {prescription.insuranceInfo.coverage}</p>
                        <p><strong>Copay:</strong> {prescription.insuranceInfo.copay}</p>
                    </div>
                </div>

                <div className="notes-section">
                    <h2>Additional Notes</h2>
                    <p>{prescription.additionalNotes}</p>
                </div>

                <div className="prescription-actions">
                    <button className="action-button refill">Request Refill</button>
                    <button className="action-button download">Download Prescription</button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionDetails; 