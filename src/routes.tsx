import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DataProvider } from './store';
import Homepage from './pages/homepage';
import FeedPage from './pages/feedpage';

const routes = () => {
  return (
    <Router>
      <DataProvider>
        <Switch>
          <Route path="/feed/:id">
            <FeedPage />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </DataProvider>
    </Router>
  );
};

export default routes;
