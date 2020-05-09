/* eslint-disable @typescript-eslint/interface-name-prefix */
import React from 'react';
import { RouteWithProps } from './RouteWithProps';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';

interface IProctedRouteProp extends RouteProps {
  // component: React.FC<IRouteComp>;
  path: string;
  permissions: Array<string>;
}
// const ProctedRoute: React.FC<IProctedRouteProp> = function ({ component, path, permissions }) {};
// export default ProctedRoute;
