import { useNavigate } from "react-router-dom";

function Completion() {
  const navigate = useNavigate();

  const handleCookAnother = () => {
    navigate("/recipes");
  };

  const handleSaveSession = () => {
    alert("Cooking session saved!");
    navigate("/dashboard");
  };

  return (
    <main
     className="container"
    >
      <h1>Recipe Completed 🎉</h1>

      <p>Your dish is ready!</p>

      <button
        onClick={handleSaveSession}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "16px",
        }}
      >
        Save Cooking Session
      </button>

      <button
        onClick={handleCookAnother}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "12px",
        }}
      >
        Cook Another Recipe
      </button>
    </main>
  );
}

export default Completion;