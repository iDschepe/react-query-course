import { Route, Routes, Link, useMatch } from "react-router-dom";
import Issues from "./pages/Issues";
import Issue from "./pages/Issue";
import AddIssue from "./pages/AddIssue";
import FetchingIndicator from "./components/FetchingIndicator";

window.GITHUB_TOKEN = "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";

function App() {
  const isRootPath = useMatch({ path: "/", end: true });
  return (
    <div className="App">
      {!isRootPath ? (
        <Link to="/">Back to Issues List</Link>
      ) : (
        <span>&nbsp;</span>
      )}
      <h1>Issue Tracker</h1>
      <Routes>
        <Route path="/" element={<Issues />} />
        <Route path="/add" element={<AddIssue />} />
        <Route path="/issue/:number" element={<Issue />} />
      </Routes>
      <FetchingIndicator />
    </div>
  );
}

export default App;
