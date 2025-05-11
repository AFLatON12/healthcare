import React from 'react';
import Transactions from './Transactions';

const DoctorTransactions = ({ doctorId }) => {
    return <Transactions filterType="doctor_id" filterId={doctorId} />;
};

export default DoctorTransactions; 