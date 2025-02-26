import { useState, useEffect, useCallback } from "react"

export default function InternetSpeedTracker() {
  const [speed, setSpeed] = useState(null)
  const [connectionType, setConnectionType] = useState("unknown")
  const [isOnline, setIsOnline] = useState(true)
  const [lastChecked, setLastChecked] = useState(null)

  const checkSpeed = useCallback(async () => {
    try {
      const startTime = new Date().getTime()

      // Fetch a small file to test speed (with cache busting)
      const response = await fetch(`https://www.cloudflare.com/cdn-cgi/trace?t=${startTime}`, { cache: "no-store" })

      if (!response.ok) throw new Error("Network response was not ok")

      const text = await response.text()
      const endTime = new Date().getTime()

      const duration = (endTime - startTime) / 1000
      const fileSizeInBits = text.length * 8
      const speedMbps = fileSizeInBits / duration / 1000000
    
      setSpeed(speedMbps.toFixed(2))
      setLastChecked(new Date().toLocaleTimeString())
      setIsOnline(true)
    } catch (error) {
      console.error("Error checking speed:", error)
      setIsOnline(false)
      setSpeed(null)
    }
  }, [])

  const checkConnectionType = useCallback(() => {
    if (navigator.connection) {
      setConnectionType(navigator.connection.effectiveType || "unknown")
    }
  }, [])

  useEffect(() => {
    checkSpeed()
    checkConnectionType()

    const speedInterval = setInterval(checkSpeed, 10000)

    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

    if (navigator.connection) {
      navigator.connection.addEventListener("change", checkConnectionType)
    }

    return () => {
      clearInterval(speedInterval)
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))

      if (navigator.connection) {
        navigator.connection.removeEventListener("change", checkConnectionType)
      }
    }
  }, [checkSpeed, checkConnectionType])

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", margin: "10px", maxWidth: "400px" }}>
      <h2>Internet Speed Monitor</h2>
      <div>
        <p>
          <strong>Status:</strong> {isOnline ? "Online ✅" : "Offline ❌"}
        </p>
        <p>
          <strong>Connection Type:</strong> {connectionType}
        </p>
        <p>
          <strong>Estimated Speed:</strong> {speed ? `${speed} Mbps` : "Checking..."}
        </p>
        {lastChecked && (
          <p>
            <strong>Last checked:</strong> {lastChecked}
          </p>
        )}
      </div>
    </div>
  )
}

