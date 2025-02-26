import { useState, useEffect, useCallback } from "react"

export default function LocationTracker() {
  const [ipInfo, setIpInfo] = useState(null)
  const [geoLocation, setGeoLocation] = useState(null)
  const [error, setError] = useState(null)
  const [lastActivity, setLastActivity] = useState(new Date())

  const getIpInfo = useCallback(async () => {
    try {
      const response = await fetch("http://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,isp,query")
      if (!response.ok) throw new Error("Failed to fetch IP information")

      const data = await response.json()
      if (data.status !== "success") throw new Error(data.message)

      setIpInfo({
        ip: data.query,
        city: data.city || "Unknown",
        region: data.regionName || "Unknown",
        country: data.country || "Unknown",
        loc: `${data.lat},${data.lon}`,
        org: data.isp || "Unknown",
      })
    } catch (err) {
      console.error("Error fetching IP info:", err)
      setError("Failed to fetch IP information: " + err.message)
    }
  }, [])

  const getGeoLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (err) => {
        console.error("Error getting geolocation:", err)
        setError(`Geolocation error: ${err.message}`)
      }
    )
  }, [])

  const trackActivity = useCallback(() => {
    setLastActivity(new Date())
    getIpInfo()
    getGeoLocation()
  }, [getGeoLocation, getIpInfo])

  useEffect(() => {
    getIpInfo()
    getGeoLocation()

    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach((event) => window.addEventListener(event, trackActivity))

    return () => {
      events.forEach((event) => window.removeEventListener(event, trackActivity))
    }
  }, [getGeoLocation, getIpInfo, trackActivity])

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", margin: "10px", maxWidth: "400px" }}>
      <h2>Location Tracker</h2>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <div style={{ marginBottom: "15px" }}>
        <h3>IP Information {!ipInfo && "(Loading...)"}</h3>
        {ipInfo ? (
          <div>
            <p><strong>IP:</strong> {ipInfo.ip}</p>
            <p><strong>City:</strong> {ipInfo.city}</p>
            <p><strong>Region:</strong> {ipInfo.region}</p>
            <p><strong>Country:</strong> {ipInfo.country}</p>
            <p><strong>Location:</strong> {ipInfo.loc}</p>
            <p><strong>ISP:</strong> {ipInfo.org}</p>
          </div>
        ) : (
          <p>Fetching IP information...</p>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h3>Browser Geolocation</h3>
        {geoLocation ? (
          <div>
            <p><strong>Latitude:</strong> {geoLocation.latitude}</p>
            <p><strong>Longitude:</strong> {geoLocation.longitude}</p>
            <p><strong>Accuracy:</strong> {geoLocation.accuracy} meters</p>
          </div>
        ) : (
          <p>Waiting for geolocation permission...</p>
        )}
      </div>

      <div>
        <p><strong>Last Activity:</strong> {lastActivity.toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
