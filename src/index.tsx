/* eslint-disable */

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import List from './routes/list';
import Test from './routes/test';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ImportPage from './routes/import';
import { ROOT_NAME } from './constants';
import { DbStoreProvider } from './stores/db-store/store';
import NavBar from './components/NavBar';
import HomePage from './routes/home';
import CoursePage from './routes/course';
import DeckPage from './routes/deck';
import AddCardPage from './routes/add-card';
import CardPage from './routes/card';
import CardsPage from './routes/cards';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DbStoreProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path={ROOT_NAME + '/'} element={<App />}></Route>
          <Route path={ROOT_NAME + '/list'} element={<List />}></Route>
          <Route path={ROOT_NAME + '/test'} element={<Test />}></Route>
          <Route path={ROOT_NAME + '/import'} element={<ImportPage />}></Route>
          <Route path={ROOT_NAME + '/home'} element={<HomePage />}></Route>
          <Route path={ROOT_NAME + '/courses/:id'} element={<CoursePage />}></Route>
          <Route path={ROOT_NAME + '/decks/:id'} element={<DeckPage />}></Route>
          <Route path={ROOT_NAME + '/add-card'} element={<AddCardPage />}></Route>
          <Route path={ROOT_NAME + '/cards/:id'} element={<CardPage />}></Route>
          <Route path={ROOT_NAME + '/cards'} element={<CardsPage />}></Route>
        </Routes>
      </BrowserRouter>
    </DbStoreProvider>
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
