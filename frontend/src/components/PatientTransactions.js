import React from 'react';
import Transactions from '../pages/Transactions';

const PatientTransactions = ({ patientId }) => {
    return <Transactions filterType="patient_id" filterId={patientId} />;
};

export default PatientTransactions; 