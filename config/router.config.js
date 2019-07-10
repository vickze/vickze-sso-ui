export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      //login
      {
        path: '/',
        component: './User/Login',
        routes: [
          { path: '/', name: 'login', }
        ]
      },
    ]
  }
];
