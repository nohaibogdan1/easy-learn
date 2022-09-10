import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import List from './routes/list';
import Insert from './routes/insert';
import Test from './routes/test';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Data from './routes/data';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <nav>
        <Link to="/insert"> Add Question Answer </Link>
        <Link to="/list"> Questions Answers (Disabled)</Link>
        <Link to="/test"> Test </Link>
        <Link to="/data"> Import Export </Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="list" element={<List />}></Route>
        <Route path="insert" element={<Insert />}></Route>
        <Route path="test" element={<Test />}></Route>
        <Route path="data" element={<Data />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: () => {
    console.log('Called onUpdate');
  },
  onSuccess: () => {
    console.log('Called onSuccess');
  }
});
