import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import PanelUsers from "./routes/PanelUsers";
import Auntification from "./routes/Auntification";
import $ from "jquery";

function App() {
  const [logining, setLogining] = useState(null);

  setInterval(() => setLogining(sessionStorage.getItem('logining')), 1000);
  
  return (
    <>
      {logining && <PanelUsers />}
      {!logining && <Auntification getLoding={setLogining}/>}
    </>
  );

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);
