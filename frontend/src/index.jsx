import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Home from './pages/Home';
import GlobalStyle from './utils/style/GlobalStyle';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Error404 from './pages/Error404';
import Footer from './components/Footer';
import Account from './pages/Account';
import Header from './components/Header';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import UpdatePost from './pages/UpdatePost';

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
            <Header/>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/post/:id' element={<SinglePost/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/account/:id' element={<Account/>}/>
                <Route path='/createPost' element={<CreatePost/>}/>
                <Route path='/updatePost/:id' element={<UpdatePost/>} />
                <Route path='*' element={<Error404/>}/>
              </Routes>
            <Footer/>
          </LoaderProvider>
        </ErrorProvider>
      </AuthProvider>  
    </Router>    
  </React.StrictMode>
);

