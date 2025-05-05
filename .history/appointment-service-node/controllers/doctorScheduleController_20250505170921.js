const DoctorSchedule = require('../models/DoctorSchedule');

let doctorScheduleCache = null; // Simple in-memory cache for demo purposes

// Get the doctor's schedule (for simplicity, assume one schedule)
exports.getDoctorSchedule = async (req, res) => {
  try {
    if (!doctorScheduleCache) {
      // In real app, fetch from DB. Here, create a new schedule if none exists.
      doctorScheduleCache = new DoctorSchedule({
        doctorId: 'default-doctor-id',
        timeSlots: []
      });
      await doctorScheduleCache.save();
    }
    res.json({ timeSlots: doctorScheduleCache.timeSlots });
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    res.status(500).json({ error: 'Failed to fetch doctor schedule' });
  }
};

// Add a new time slot
exports.addTimeSlot = async (req, res) => {
  try {
    const { startTime, endTime, isAvailable } = req.body;
    if (!doctorScheduleCache) {
      doctorScheduleCache = new DoctorSchedule({
        doctorId: 'default-doctor-id',
        timeSlots: []
      });
    }
    const newSlot = {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      createdAt: new Date()
    };
    doctorScheduleCache.timeSlots.push(newSlot);
    await doctorScheduleCache.save();
    // Return the last added time slot with its _id
    const addedSlot = doctorScheduleCache.timeSlots[doctorScheduleCache.timeSlots.length - 1];
    res.status(201).json(addedSlot);
  } catch (error) {
    console.error('Error adding time slot:', error);
    res.status(500).json({ error: 'Failed to add time slot' });
  }
};

// Delete a time slot by id
exports.deleteTimeSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    if (!doctorScheduleCache) {
      return res.status(404).json({ error: 'Doctor schedule not found' });
    }
    doctorScheduleCache.timeSlots = doctorScheduleCache.timeSlots.filter(slot => slot._id.toString() !== slotId);
    await doctorScheduleCache.save();
    // Return updated timeSlots array
    res.status(200).json(doctorScheduleCache.timeSlots);
  } catch (error) {
    console.error('Error deleting time slot:', error);
    res.status(500).json({ error: 'Failed to delete time slot' });
  }
};

// Update time slot availability
exports.updateTimeSlotAvailability = async (req, res) => {
  try {
    const slotId = req.params.id;
    const { isAvailable } = req.body;
    if (!doctorScheduleCache) {
      return res.status(404).json({ error: 'Doctor schedule not found' });
    }
    const slot = doctorScheduleCache.timeSlots.id(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }
    // Convert isAvailable to boolean robustly
    let boolAvailable = false;
    if (typeof isAvailable === 'boolean') {
      boolAvailable = isAvailable;
    } else if (typeof isAvailable === 'string') {
      boolAvailable = isAvailable.toLowerCase() === 'true';
    }
    slot.isAvailable = boolAvailable;
    await doctorScheduleCache.save();
    res.status(200).json(slot);
  } catch (error) {
    console.error('Error updating time slot availability:', error);
    res.status(500).json({ error: 'Failed to update time slot availability' });
  }
};
