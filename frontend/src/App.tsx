import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/test")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  return <h1>testing</h1>;
}

export default App;
