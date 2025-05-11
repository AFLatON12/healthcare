const { Appointment, STATUS_PENDING, STATUS_CONFIRMED, STATUS_CANCELLED, STATUS_COMPLETED } = require('../models/Appointment');
const { getDoctorDetails } = require('../clients/authClient');

class AppointmentController {
  async scheduleAppointment(appointmentData) {
    // TODO: Validate time slot availability (requires doctor schedule service)
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    // TODO: Initialize patient record if needed (requires patient record service)
    return appointment;
  }

  async confirmAppointment(id, price) {
    const updateData = { status: STATUS_CONFIRMED, updatedAt: new Date() };
    if (price !== undefined) {
      updateData.price = price;
    }
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, status: STATUS_PENDING },
      updateData,
      { new: true }
    );
    if (!appointment) {
      throw new Error('Appointment not found or not in pending status');
    }
    // Create payment record with price and status pending
    if (price !== undefined) {
      const paymentController = require('./paymentController');
      await paymentController.createPayment(appointment._id, price, null);
    }
    return appointment;
  }

  async startAppointment(id) {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, status: STATUS_CONFIRMED },
      { status: STATUS_CONFIRMED, updatedAt: new Date() },
      { new: true }
    );
    if (!appointment) {
      throw new Error('Appointment not found or not in confirmed status');
    }
    return appointment;
  }

  async completeAppointment(id, notes, prescription) {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    // TODO: Add doctor note to patient record (requires patient record service)
    // TODO: Create prescription if provided (requires prescription service)
    appointment.status = STATUS_COMPLETED;
    appointment.notes = notes;
    appointment.updatedAt = new Date();
    await appointment.save();
    return appointment;
  }

  async cancelAppointment(id, reason) {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, status: { $in: [STATUS_PENDING, STATUS_CONFIRMED] } },
      { status: STATUS_CANCELLED, notes: reason, updatedAt: new Date() },
      { new: true }
    );
    if (!appointment) {
      throw new Error('Appointment not found or cannot be canceled');
    }
    return appointment;
  }

  async getById(id) {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  }

  async getPaymentByAppointment(appointmentId) {
    const paymentController = require('./paymentController');
    const payment = await paymentController.getPaymentByAppointment(appointmentId);
    return payment;
  }

  async getByPatientId(patientId) {
    return Appointment.find({ patientId });
  }

  async getByDoctorId(doctorId) {
    return Appointment.find({ doctorId });
  }

  async deleteAppointment(id) {
    const appointment = await Appointment.findByIdAndDelete(id);
    return appointment;
  }

  async getAppointmentsByPatient(patientId) {
    const appointments = await Appointment.find({ patientId });

    // Fetch doctor details for each appointment
    const appointmentsWithDoctorDetails = await Promise.all(
      appointments.map(async (appointment) => {
        try {
          const doctorDetails = await getDoctorDetails(appointment.doctorId);
          return { ...appointment.toObject(), doctorDetails };
        } catch (error) {
          console.error(`Failed to fetch doctor details for appointment ID: ${appointment._id}`);
          return { ...appointment.toObject(), doctorDetails: null };
        }
      })
    );

    return appointmentsWithDoctorDetails;
  }
}

module.exports = new AppointmentController();
