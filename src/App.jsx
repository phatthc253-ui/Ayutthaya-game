import { useState } from "react"
import TopNav from "./components/TopNav"

export default function App() {
  const [score, setScore] = useState(10)

  return (
    <div>
      <TopNav score={score} />

      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Ayutthaya Trade Adventure 🚢
      </h1>
    </div>
  )
}