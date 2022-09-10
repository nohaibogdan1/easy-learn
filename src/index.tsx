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
import { ROOT_NAME } from './constants';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <nav>
        <Link to={ROOT_NAME + '/insert'}> Add Question Answer </Link>
        <Link to={ROOT_NAME + '/test'}> Test </Link>
        <Link to={ROOT_NAME + '/data'}> Import </Link>
      </nav>
      <Routes>
        <Route path={ROOT_NAME + '/'} element={<App />}></Route>
        <Route path={ROOT_NAME + '/list'} element={<List />}></Route>
        <Route path={ROOT_NAME + '/insert'} element={<Insert />}></Route>
        <Route path={ROOT_NAME + '/test'} element={<Test />}></Route>
        <Route path={ROOT_NAME + '/data'} element={<Data />}></Route>
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
