import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';
import Exception403 from '@/pages/Exception/403';

function AuthComponent({ children, location, routerData }) {
  const auth = getAuthority();
  const isLogin = auth && auth[0] !== 'undefined';
  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      //const regex = new RegExp(`^${route.path}/?$`);
      const regex = pathToRegexp(`${route.path}(.*)`);
      if (regex.test(path)) {
        authorities = route.authority || authorities;

        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;
        }
      }
    });
    return authorities;
  };
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Exception403 /> : <Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData,
}))(AuthComponent);
