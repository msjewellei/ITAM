import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { MiscProvider } from "./context/miscellaneousContext.tsx";
import { AssetProvider } from "./context/assetContext.tsx";
import { BorrowProvider } from "./context/borrowContext.tsx";
import { RepairProvider } from "./context/repairContext.tsx";
import { IssuanceProvider } from "./context/issuanceContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MiscProvider>
      <AssetProvider>
        <IssuanceProvider>
          <RepairProvider>
            <BrowserRouter>
              <BorrowProvider>
                <App />
              </BorrowProvider>
            </BrowserRouter>
          </RepairProvider>
        </IssuanceProvider>
      </AssetProvider>
    </MiscProvider>
  </StrictMode>
);
