import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DisplayWeather } from "./components/DisplayWeather"
import { Hero } from "./components/Hero";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Hero />}/>
                <Route path="/weather" element={<DisplayWeather />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App