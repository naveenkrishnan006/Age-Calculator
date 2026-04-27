import AgeCalculator from './AgeCalculator'

function App() {
  return (
    <div className="app-container">
      <div className="star-field" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>
      <AgeCalculator />
    </div>
  )
}

export default App

