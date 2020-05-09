/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
interface IRouteComp extends RouteComponentProps {
  title?: string;
}
interface IRouteWithProps extends RouteProps {
  // path: string;
  component: React.FC<IRouteComp>;
  title?: string;
  // eslint-disable-next-line react/prop-types
}
const RouteWithProps: React.FC<IRouteWithProps> = function ({ path, component: Comp, title = '' }) {
  console.log('rnn');
  return <Route exact path={path} render={(props) => <Comp {...props} title={title} />} />;
};

export { RouteWithProps };
