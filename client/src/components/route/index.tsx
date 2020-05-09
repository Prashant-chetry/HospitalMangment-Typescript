import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthForm from '../auth';
import { RouteWithProps } from '../../common/RouteWithProps';
import EditUserProfile from '../user/Edit';
const Routes: React.FC<{}> = function () {
  return (
    <BrowserRouter>
      <Switch>
        <RouteWithProps path="/signUp" component={AuthForm} title="Sign Up" />
        <RouteWithProps path="/login" component={AuthForm} title="Log In" />
        <Route exact path="/user/edit" component={EditUserProfile} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
