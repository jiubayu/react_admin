import {
  BrowserRouter,
  createBrowserRouter,
  Link,
  Route,
  // RouterProvider,
  Routes,
} from 'react-router-dom';
import routes from './router';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Dashboard from './pages/dashboard';
import Settings from './pages/management/user/settings';
import Profile from './pages/management/user/profile';
import Detail from './pages/detail';
// import ErrorBoundary from './components/ErrorBoundary';

// const router = createBrowserRouter(routes);
function App() {
  return (
    <div>
      {/* <ErrorBoundary> */}
      {/* <RouterProvider router={router} /> */}
      {/* </ErrorBoundary> */}

      {/* 方式一 */}
      {/* BrowserRouter 使用html5 history api（如pushState, replaceState）来保持UI与URL同步，适用于普通的web应用程序 */}
      <BrowserRouter>
        <nav>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/contact'>Concat</Link>
          </li>
          <li>
            <Link to='/dashboard'>dashboard</Link>
          </li>
          <li>
            <Link to='/detail/12'>detail</Link>
          </li>
        </nav>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='dashboard' element={<Dashboard />}>
            <Route path='settings' element={<Settings />}></Route>
            <Route path='profile' element={<Profile />}></Route>
          </Route>
          <Route path='/detail/:id' element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
