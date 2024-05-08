import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Dashboard from './routes/Dashboard';
import CreateGroup from './routes/CreateGroup';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
  },
  {
    path:"/login",
    element:<Login/>,
  },
  {
    path:"/register",
    element:<Register/>,
  },
  {
    path:"/dashboard",
    element:<Dashboard/>,
  },
  {
    path:"/group/create",
    element:<CreateGroup/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
