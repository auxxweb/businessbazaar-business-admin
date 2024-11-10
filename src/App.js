import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./api/store";

import Browse from "./components/semntics/Browse";
import { Toaster } from "sonner";

import 'primereact/resources/themes/saga-blue/theme.css' 
import 'primereact/resources/primereact.min.css'


import 'primeicons/primeicons.css';         


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Browse />
        {/* Wrap your app in BrowserRouter */}
        <Toaster />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
