import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Home from './pages/Home';
import GlobalStyle from './utils/style/GlobalStyle';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Error404 from './pages/Error404';
import HeaderLayout from './components/HeaderLayout';
import Footer from './components/Footer';

import { ErrorProvider } from './utils/context/ErrorContext';
import { LoaderProvider } from './utils/context/LoaderContext';
import { AuthProvider } from './utils/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> 
        <ErrorProvider>
          <LoaderProvider>
            <GlobalStyle/>
            <Routes>
              <Route path='/' element={<HeaderLayout><Home/></HeaderLayout>}/>
              <Route path='/login' element={<HeaderLayout><Login/></HeaderLayout>}/>
              <Route path='/signup' element={<HeaderLayout><Signup/></HeaderLayout>}/>

              <Route path='*' element={<Error404/>}/>
            </Routes>
            <Footer/>
          </LoaderProvider>
        </ErrorProvider>
      </AuthProvider>  
    </Router>    
  </React.StrictMode>
);

