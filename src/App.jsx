import { useState } from "react"
import TopNav from "./components/TopNav"

export default function App() {
  const [score, setScore] = useState(10)

 return (
  <div style={{ minHeight: "100vh", width: "100vw" }}>
    Hello
  </div>
);
}