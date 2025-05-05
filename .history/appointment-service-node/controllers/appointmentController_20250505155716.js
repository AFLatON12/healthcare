const { Appointment, STATUS_PENDING, STATUS_CONFIRMED, STATUS_CANCELLED, STATUS_COMPLETED } = require('../models/Appointment');

class AppointmentController {
  async scheduleAppointment(appointmentData) {
    // TODO: Validate time slot availability (requires doctor schedule service)
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    // TODO: Initialize patient record if needed (requires patient record service)
    return appointment;
  }

  async confirmAppointment(id) {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, status: STATUS_PENDING },
      { status: STATUS_CONFIRMED, updatedAt: new Date() },
      { new: true }
    );
    if (!appointment) {
      throw new Error('Appointment not found or not in pending status');
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

  async getByPatientId(patientId) {
    return Appointment.find({ patientId });
  }

  async getByDoctorId(doctorId) {
    return Appointment.find({ doctorId });
  }
}

module.exports = new AppointmentController();
