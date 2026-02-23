export default function TopNav({ score }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#8B5A2B",
      color: "white",
      fontWeight: "bold"
    }}>
      <div>🏯 Ayutthaya Game</div>
      <div>💰 {score}</div>
    </div>
  )
}