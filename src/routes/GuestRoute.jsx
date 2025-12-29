import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children, user }) => {
    if (user) {
        // If user is logged in, redirect to the main app feed (now root "/")
        return <Navigate to="/" replace />;
    }
    return children;
};

export default GuestRoute;
