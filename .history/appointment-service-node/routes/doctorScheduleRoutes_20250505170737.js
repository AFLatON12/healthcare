const express = require('express');
const router = express.Router();
const doctorScheduleController = require('../controllers/doctorScheduleController');

router.get('/', doctorScheduleController.getDoctorSchedule);
router.post('/', doctorScheduleController.addTimeSlot);
router.delete('/:id', doctorScheduleController.deleteTimeSlot);
router.patch('/:id', doctorScheduleController.updateTimeSlotAvailability);

module.exports = router;
