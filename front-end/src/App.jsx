import InternetSpeedTracker from "./InternetSpeedTracker/internet-speed-tracker"
import LocationTracker from "./LocationActivityTracker/location-activity-tracker"

export default function App() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Tracking Components</h1>
      <InternetSpeedTracker />
      <LocationTracker />
    </main>
  )
}

