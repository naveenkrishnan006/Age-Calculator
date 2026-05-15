import { useState, useEffect, useRef } from 'react'

function CircularRing({ value, max, label, color }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = max > 0 ? (value / max) * circumference : 0
  const dashoffset = circumference - progress

  return (
    <div className="ring-wrapper">
      <svg width="90" height="90" className="ring-svg">
        <circle
          cx="45"
          cy="45"
          r={radius}
          className="ring-bg"
        />

        <circle
          cx="45"
          cy="45"
          r={radius}
          className="ring-progress"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{
            transition: 'stroke-dashoffset 0.3s linear'
          }}
        />

        <text
          x="45"
          y="48"
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize="14"
          fontFamily="DM Mono, monospace"
          fontWeight="500"
        >
          {value}
        </text>
      </svg>

      <span className="ring-label">{label}</span>
    </div>
  )
}

export default function AgeCalculator() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const intervalRef = useRef(null)

  const [liveTicks, setLiveTicks] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem('ageHistory')) || []

    setHistory(savedHistory)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startLiveTicks = (dobDate) => {
    const update = () => {
      const now = new Date()
      const diff = now - new Date(dobDate)

      const totalSeconds = Math.floor(diff / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)

      setLiveTicks({
        hours: totalHours % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60
      })
    }

    update()

    intervalRef.current = setInterval(update, 1000)
  }

  const validate = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
    }

    if (!dob) {
      newErrors.dob = 'Please select your date of birth'
    } else {
      const d = new Date(dob)

      if (isNaN(d.getTime())) {
        newErrors.dob = 'Invalid date'
      } else if (d > new Date()) {
        newErrors.dob =
          'Date of birth cannot be in the future'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)

      const birthDate = new Date(dob)
      const now = new Date()

      let years =
        now.getFullYear() - birthDate.getFullYear()

      let months =
        now.getMonth() - birthDate.getMonth()

      let days =
        now.getDate() - birthDate.getDate()

      if (days < 0) {
        months--

        const prevMonthDays = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        ).getDate()

        days += prevMonthDays
      }

      if (months < 0) {
        years--
        months += 12
      }

      const diffMs = now - birthDate

      const totalSeconds = Math.floor(diffMs / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)
      const totalWeeks = Math.floor(totalDays / 7)

      // Next Birthday
      const nextBirthday = new Date(
        now.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      )

      if (nextBirthday < now) {
        nextBirthday.setFullYear(
          now.getFullYear() + 1
        )
      }

      const daysUntilNextBirthday = Math.ceil(
        (nextBirthday - now) /
          (1000 * 60 * 60 * 24)
      )

      const data = {
        success: true,

        user: {
          name,
          dob
        },

        age: {
          years,
          months,
          days,
          totalDays,
          totalWeeks,
          totalHours,
          totalMinutes,
          totalSeconds,
          daysUntilNextBirthday
        }
      }

      setResult(data)

      startLiveTicks(dob)

      // Save History
      const updatedHistory = [
        {
          _id: Date.now(),
          name,
          dob
        },
        ...history
      ]

      setHistory(updatedHistory)

      localStorage.setItem(
        'ageHistory',
        JSON.stringify(updatedHistory)
      )
    } catch (err) {
      setErrors({
        form: 'Something went wrong'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setName('')
    setDob('')
    setErrors({})
    setResult(null)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="glass-card">
      <h1 className="heading">
        Age Calculator
      </h1>

      {!result ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label
              className="form-label"
              htmlFor="name"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              className={`form-input ${
                errors.name ? 'error' : ''
              }`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <div className="error-text">
              {errors.name || ''}
            </div>
          </div>

          <div className="form-group">
            <label
              className="form-label"
              htmlFor="dob"
            >
              Date of Birth
            </label>

            <input
              id="dob"
              type="date"
              className={`form-input ${
                errors.dob ? 'error' : ''
              }`}
              value={dob}
              onChange={(e) =>
                setDob(e.target.value)
              }
            />

            <div className="error-text">
              {errors.dob || ''}
            </div>
          </div>

          {errors.form && (
            <div
              className="error-text"
              style={{
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}
            >
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? 'Calculating...'
              : 'Calculate'}
          </button>
        </form>
      ) : (
        <div
          style={{
            animation:
              'fadeIn 0.6s ease-out both'
          }}
        >
          <div className="greeting">
            Hello, <span>{result.user.name}</span>
          </div>

          <div className="year-display">
            {result.age.years}
          </div>

          <div className="year-label">
            Years Old
          </div>

          <div className="breakdown">
            <div className="breakdown-item">
              <div className="breakdown-value">
                {result.age.years}
              </div>

              <div className="breakdown-label">
                Years
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-value">
                {result.age.months}
              </div>

              <div className="breakdown-label">
                Months
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-value">
                {result.age.days}
              </div>

              <div className="breakdown-label">
                Days
              </div>
            </div>
          </div>

          <div className="rings-container">
            <CircularRing
              value={liveTicks.hours}
              max={24}
              label="Hours"
              color="#e879f9"
            />

            <CircularRing
              value={liveTicks.minutes}
              max={60}
              label="Minutes"
              color="#a78bfa"
            />

            <CircularRing
              value={liveTicks.seconds}
              max={60}
              label="Seconds"
              color="#60a5fa"
            />
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                {result.age.totalDays.toLocaleString()}
              </div>

              <div className="stat-label">
                Total Days
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {result.age.totalWeeks.toLocaleString()}
              </div>

              <div className="stat-label">
                Total Weeks
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {result.age.totalHours.toLocaleString()}
              </div>

              <div className="stat-label">
                Total Hours
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {result.age.totalMinutes.toLocaleString()}
              </div>

              <div className="stat-label">
                Total Minutes
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {result.age.totalSeconds.toLocaleString()}
              </div>

              <div className="stat-label">
                Total Seconds
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {
                  result.age
                    .daysUntilNextBirthday
                }
              </div>

              <div className="stat-label">
                Days Until Birthday
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Calculate Again
          </button>
        </div>
      )}

      <div className="history-section">
        <h2 className="sub-heading">
          Recent History
        </h2>

        {history.length === 0 ? (
          <div className="empty-history">
            No calculations yet. Be the first!
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div
                key={item._id}
                className="history-item"
              >
                <span className="history-name">
                  {item.name}
                </span>

                <span className="history-dob">
                  {formatDate(item.dob)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
