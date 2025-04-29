import React, { useState, useEffect } from 'react';
import '../styles/Prescriptions.css';
import { prescriptionAPI } from '../services/api';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');
    const [isNewPrescriptionModalOpen, setIsNewPrescriptionModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const data = await prescriptionAPI.getPrescriptions();
            setPrescriptions(data);
        } catch (err) {
            setError('Failed to fetch prescriptions');
            console.error('Prescriptions fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
    };

    const handleCloseDetails = () => {
        setSelectedPrescription(null);
    };

    const handleNewPrescription = (e) => {
        e.preventDefault();
        // TODO: Implement new prescription logic
        console.log('Creating new prescription');
        setIsNewPrescriptionModalOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
                <button
                    className="new-prescription-btn"
                    onClick={() => setIsNewPrescriptionModalOpen(true)}
                >
                    New Prescription
                </button>
            </div>

            {/* Prescriptions List */}
            <div className="bg-white shadow rounded-lg divide-y">
                {prescriptions.length > 0 ? (
                    prescriptions.map((prescription) => (
                        <div
                            key={prescription.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Prescription #{prescription.id}
                                    </h3>
                                    <p className="mt-1 text-gray-500">
                                        Dr. {prescription.doctorName}
                                    </p>
                                    <p className="mt-1 text-gray-500">
                                        {new Date(prescription.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(prescription)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No prescriptions found
                    </div>
                )}
            </div>

            {/* Prescription Details Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Prescription Details
                            </h2>
                            <button
                                onClick={handleCloseDetails}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                                <p className="mt-1 text-gray-900">
                                    Dr. {selectedPrescription.doctorName}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                <p className="mt-1 text-gray-900">
                                    {new Date(selectedPrescription.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Medications</h3>
                                <div className="mt-2 space-y-2">
                                    {selectedPrescription.medications.map((medication, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 p-3 rounded-md"
                                        >
                                            <p className="font-medium text-gray-900">
                                                {medication.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Dosage: {medication.dosage}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Frequency: {medication.frequency}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedPrescription.notes && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1 text-gray-900">
                                        {selectedPrescription.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleCloseDetails}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
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