import NavBar from "./components/NavBar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { BrowserRouter } from "react-router-dom";


export default function App() {

  return (
    <div id="app">
      <BrowserRouter>
        <NavBar />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}
