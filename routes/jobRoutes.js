const express = require('express');
const Job = require('../models/Job'); // Adjust according to your folder structure
const router = express.Router();

// Get all jobs (including notifications)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs); // Return jobs, including notifications
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Add a job
router.post('/', async (req, res) => {
  const { jobTitle, salaryRange, applyLink } = req.body;
  try {
    const newJob = new Job({ jobTitle, salaryRange, applyLink });
    await newJob.save();
    res.json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Error adding job' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  const { jobTitle, salaryRange, applyLink } = req.body;
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { jobTitle, salaryRange, applyLink },
      { new: true }
    );
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// Get notifications for a specific job title
router.get('/notifications/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const jobs = await Job.find({ jobTitle: title, notifications: { $exists: true, $ne: [] } });
    const allNotifications = jobs.flatMap(job => job.notifications);
    res.json(allNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Add a notification to a job (including dynamic inputs and additional dates)
router.post('/:jobId/notifications', async (req, res) => {
  const { jobId } = req.params; // Correct way to extract jobId
  const formData = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Push the dynamic input fields along with other data, including additional dates
    job.notifications.push({
      ...formData,
      dynamicInputs: formData.dynamicInputs || [],  // Ensure dynamic inputs are added
      additionalDates: formData.additionalDates || []  // Ensure additional dates are added
    });

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error saving notification' });
  }
});

// Update a specific notification in a job
router.put('/:jobId/notifications/:notificationId', async (req, res) => {
  const { jobId, notificationId } = req.params;
  const updateData = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const notificationIndex = job.notifications.findIndex(
      (notif) => notif._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update notification with the new data, ensuring dynamicInputs and additionalDates are also updated
    job.notifications[notificationIndex] = {
      ...job.notifications[notificationIndex],
      ...updateData,
    };

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Delete a specific notification from a job
router.delete('/:jobId/notifications/:notificationId', async (req, res) => {
  const { jobId, notificationId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const notificationIndex = job.notifications.findIndex(
      (notif) => notif._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Remove the notification from the job
    job.notifications.splice(notificationIndex, 1);
    await job.save();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

module.exports = router;
