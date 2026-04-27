import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = '/api'

function CircularRing({ value, max, label, color }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = max > 0 ? (value / max) * circumference : 0
  const dashoffset = circumference - progress

  return (
    <div className="ring-wrapper">
      <svg width="90" height="90" className="ring-svg">
        <circle cx="45" cy="45" r={radius} className="ring-bg" />
        <circle
          cx="45"
          cy="45"
          r={radius}
          className="ring-progress"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
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
  const [historyLoading, setHistoryLoading] = useState(false)
  const intervalRef = useRef(null)
  const [liveTicks, setLiveTicks] = useState({ hours: 0, minutes: 0, seconds: 0 })

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const res = await axios.get(`${API_URL}/history`)
      if (res.data.success) {
        setHistory(res.data.history)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
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
    if (!name.trim()) newErrors.name = 'Please enter your name'
    if (!dob) {
      newErrors.dob = 'Please select your date of birth'
    } else {
      const d = new Date(dob)
      if (isNaN(d.getTime())) {
        newErrors.dob = 'Invalid date'
      } else if (d > new Date()) {
        newErrors.dob = 'Date of birth cannot be in the future'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/calculate`, {
        name: name.trim(),
        dob
      })

      if (res.data.success) {
        setResult(res.data)
        startLiveTicks(res.data.user.dob)
        fetchHistory()
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setErrors({ form: msg })
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
      <h1 className="heading">Age Calculator</h1>

      {!result ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="error-text">{errors.name || ''}</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              className={`form-input ${errors.dob ? 'error' : ''}`}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <div className="error-text">{errors.dob || ''}</div>
          </div>

          {errors.form && (
            <div className="error-text" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
              {errors.form}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease-out both' }}>
          <div className="greeting">
            Hello, <span>{result.user.name}</span>
          </div>

          <div className="year-display">{result.age.years}</div>
          <div className="year-label">Years Old</div>

          <div className="breakdown">
            <div className="breakdown-item">
              <div className="breakdown-value">{result.age.years}</div>
              <div className="breakdown-label">Years</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-value">{result.age.months}</div>
              <div className="breakdown-label">Months</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-value">{result.age.days}</div>
              <div className="breakdown-label">Days</div>
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
              <div className="stat-value">{result.age.totalDays.toLocaleString()}</div>
              <div className="stat-label">Total Days</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.age.totalWeeks.toLocaleString()}</div>
              <div className="stat-label">Total Weeks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.age.totalHours.toLocaleString()}</div>
              <div className="stat-label">Total Hours</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.age.totalMinutes.toLocaleString()}</div>
              <div className="stat-label">Total Minutes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.age.totalSeconds.toLocaleString()}</div>
              <div className="stat-label">Total Seconds</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.age.daysUntilNextBirthday}</div>
              <div className="stat-label">Days Until Birthday</div>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={handleReset}>
            Calculate Again
          </button>
        </div>
      )}

      <div className="history-section">
        <h2 className="sub-heading">Recent History</h2>
        {historyLoading ? (
          <div className="loading">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="empty-history">No calculations yet. Be the first!</div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="history-item">
                <span className="history-name">{item.name}</span>
                <span className="history-dob">{formatDate(item.dob)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

