import AppRoutes from "./AppRoutes";
import Navbar from "./Navbar";
import CurrUserProvider from "./CurrUserProvider";
import "./App.css";
import "@weavy/uikit-react/dist/css/weavy.css";

function App() {
  return (
    <div className="App">
      <CurrUserProvider>
        <Navbar />
        <AppRoutes />
      </CurrUserProvider>
    </div>
  );
}

export default App;
