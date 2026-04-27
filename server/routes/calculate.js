const express = require('express');
const router = express.Router();
const User = require('../models/User');

function calculateAgeData(dob) {
  const birthDate = new Date(dob);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = now - birthDate;
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    daysUntilNextBirthday
  };
}

router.post('/calculate', async (req, res) => {
  try {
    const { name, dob } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!dob) {
      return res.status(400).json({ error: 'Date of birth is required' });
    }

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const now = new Date();
    if (birthDate > now) {
      return res.status(400).json({ error: 'Date of birth cannot be in the future' });
    }

    const user = new User({ name: name.trim(), dob: birthDate });
    await user.save();

    const ageData = calculateAgeData(birthDate);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        dob: user.dob
      },
      age: ageData
    });
  } catch (err) {
    console.error('Calculate error:', err);
    res.status(500).json({ error: 'Server error while calculating age' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name dob createdAt');

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Server error while fetching history' });
  }
});

module.exports = router;

