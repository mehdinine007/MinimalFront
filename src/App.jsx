import { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Orders from './pages/orders';
import CheckOut from './pages/check-out';
import Profile from './pages/profile';
import Authentication from './pages/authentication';
import Products from './pages/products';
import Agencies from './pages/agencies';
import ContactUs from './pages/contact-us';
import Announcement from './pages/announcement';
import authContext from './context/auth/authContext';
import ProductDetails from './pages/product-details';
import Pdf from './pages/pdf';
import NotFoundPage from './pages/404';

const App = () => {
  const { isUserLogin, isUserAuth, token, userProfileData, setUserLogin } =
    useContext(authContext);

  useEffect(() => {
    let tokenLogin = token
      ? token
      : localStorage.getItem('token')
      ? `Bearer ${localStorage.getItem('token')}`
      : false;

    if (tokenLogin && !userProfileData.nationalCode) {
      const { exp } = jwtDecode(tokenLogin);
      const now = new Date().getTime() / 1000;
      if (exp > now) {
        setUserLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sharedRoutes = (
    <>
      <Route path='/' element={<Home />} />
      <Route path='products' element={<Products />} />
      <Route path='contact-us' element={<ContactUs />} />
      <Route path='announcement' element={<Announcement />} />
      <Route path='agencies' element={<Agencies />} />
      <Route
        path='product-details/:productCode?/:productId?'
        element={<ProductDetails />}
      />
      <Route path='pdf' element={<Pdf />} />
      <Route path='pdf/:orderId?' element={<Pdf />} />

      <Route path='*' element={<NotFoundPage />} />
    </>
  );

  //
  const routesBeforeLogin = (
    <>
      <Route path='authentication' element={<Authentication />} />
      <Route path='login' element={<Login />} />

      {sharedRoutes}
    </>
  );
  const routesAfterLogin = (
    <>
      <Route path='profile' element={<Profile />} />
      <Route path='orders' element={<Orders />} />
      <Route path='check-out/:uid?' element={<CheckOut />} />
      <Route path='check-out' element={<CheckOut />} />
      {sharedRoutes}
    </>
  );
  const routesAfterAuthNationalCode = (
    <>
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      {sharedRoutes}
    </>
  );

  let currentRoutes = <Routes>{routesBeforeLogin}</Routes>;

  if (isUserAuth && !isUserLogin) {
    currentRoutes = <Routes>{routesAfterAuthNationalCode}</Routes>;
  }
  if (isUserLogin) {
    currentRoutes = <Routes>{routesAfterLogin}</Routes>;
  }

  return <div className='App'>{currentRoutes}</div>;
};

export default App;
