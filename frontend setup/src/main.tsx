import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" autoClose={3000} transition={Slide} hideProgressBar newestOnTop />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);