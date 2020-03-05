import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Users from './components/User';
import AuthorizedUser from './components/AuthorizedUser';

const App = () => (
    <BrowserRouter>
        <div>
            <AuthorizedUser />
            <Users />
        </div>
    </BrowserRouter>
);

export default App;
