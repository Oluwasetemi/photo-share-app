import React from 'react';
import ApolloClient from 'react-apollo';

import { render } from '@testing-library/react';
import { url, query, client } from './index'
import App from './App';

test('renders learn react link', async () => {
    // const { allUsers } = await request(url, query)
    const { getByText } = render(
        <ApolloClient client={client}>
            <App />
        </ApolloClient>, { wrapper: <div></div> }
    );
  const linkElement = getByText(/add User/i);
  expect(linkElement).toBeInTheDocument();
});
