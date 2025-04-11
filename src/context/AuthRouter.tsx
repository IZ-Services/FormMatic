
// import HomePage from '../app/home/page';
// import SignUpPage from '../app/signUp/page';
// import LoginPage from '../app/page';
// import LoadingScreen from '../components/pages/Loading';
// import React, { useState, useEffect } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';


// // Define a type for the authentication state
// type AuthState = boolean | null;

// // Protected route component
// interface ProtectedRouteProps {
//   component: React.ComponentType<any>;
//   isAuthenticated: boolean;
//   path: string;
//   redirectTo: string;
//   exact?: boolean;
// }

// // For authenticated users
// const PrivateRoute: React.FC<ProtectedRouteProps> = ({
//   component: Component,
//   isAuthenticated,
//   redirectTo,
//   ...rest
// }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       isAuthenticated ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{ pathname: redirectTo }} />
//       )
//     }
//   />
// );

// // For non-authenticated users
// const PublicRoute: React.FC<ProtectedRouteProps> = ({
//   component: Component,
//   isAuthenticated,
//   redirectTo,
//   ...rest
// }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       !isAuthenticated ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{ pathname: redirectTo }} />
//       )
//     }
//   />
// );

// const AuthRouter: React.FC = () => {
//   // Initialize as null to represent loading state
//   const [isAuthenticated, setIsAuthenticated] = useState<AuthState>(null);
  
//   useEffect(() => {
//     const checkSession = async (): Promise<void> => {
//       try {
//         console.log('checkSession called from AuthRouter');
//         const response = await fetch('/api/checkSession');
//         const data: { authenticated: boolean } = await response.json();
        
//         setIsAuthenticated(data.authenticated);
//       } catch (error) {
//         console.error('Error checking session:', error);
//         setIsAuthenticated(false); // Assume not authenticated on error
//       }
//     };
    
//     checkSession();
//   }, []);
  
//   // Show loading screen while checking authentication
//   if (isAuthenticated === null) {
//     return <LoadingScreen />;
//   }
  
//   return (
//     <Switch>
//       <Route exact path="/">
//         <Redirect to={isAuthenticated ? "/home" : "/signup"} />
//       </Route>
      
//       <PrivateRoute
//         path="/home"
//         component={HomePage}
//         isAuthenticated={isAuthenticated}
//         redirectTo="/signup"
//         exact
//       />
      
//       <PublicRoute
//         path="/signup"
//         component={SignUpPage}
//         isAuthenticated={isAuthenticated}
//         redirectTo="/home"
//         exact
//       />
      
//       <PublicRoute
//         path="/login"
//         component={LoginPage}
//         isAuthenticated={isAuthenticated}
//         redirectTo="/home"
//         exact
//       />
      
//       {/* Add other routes as needed */}
//     </Switch>
//   );
// };

// export default AuthRouter;