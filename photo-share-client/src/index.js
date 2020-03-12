import React from 'react';
import ReactDOM from 'react-dom';
import { gql, InMemoryCache, HttpLink, ApolloLink, split, ApolloClient } from 'apollo-boost';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities'
import { ApolloProvider } from 'react-apollo';
import { persistCache } from 'apollo-cache-persist'

import './index.css';
import App from './App';

// configure cache
const cache = new InMemoryCache();
persistCache({
    cache,
    storage: localStorage
})

if (localStorage['apollo-cache-persist']) {
    let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
    cache.restore(cacheData)
}

export const uri = 'http://localhost:4000/graphql';

const httpLink = new HttpLink({ uri });

const wsLink = new WebSocketLink({ uri: 'ws://localhost:4000/graphql', options: { reconnect: true } });

const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(context => ({
        headers: {
                ...context.headers,
                authorization: localStorage.getItem('token')
        }
    }))
    return forward(operation)
})

const httpAuthLink = authLink.concat(httpLink);

const link = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription'
}, wsLink, httpAuthLink)

export const client = new ApolloClient({
    cache,
    link
});

export const TOTAL_USER_PHOTO = gql`
    query TOTAL_USER_PHOTO {
        totalUsers
        totalPhotos
    }
`;

export const ME = gql`
    query ME {
        me {
            ...userInfo
        }
    }

    fragment userInfo on User {
        id
        githubLogin
        name
        avatar
    }
`;

export const ALL_USERS = gql`
    query ALL_USERS {
        allUsers {
            id
            name
            avatar
            githubLogin
        }
    }
`;

export const GITHUB_AUTH_MUTATION = gql`
    mutation GITHUB_AUTH_MUTATION ($code: String!) {
        githubAuth (code: $code) {
            token
        }
    }
`;

export const ADD_FAKE_USER = gql`
    mutation ADD_FAKE_USER ($count: Int!) {
        addFakeUsers(count: $count) {
            id
            name
            avatar
            githubLogin
        }
    }
`;

export const COMBINED_QUERY = gql`
    query COMBINED_QUERY {
        allUsers { ...userInfo }
        me { ...userInfo }
        totalUsers
        totalPhotos
    }

    fragment userInfo on User {
        id
        name
        avatar
        githubLogin
    }
`;

export const LISTEN_FOR_USERS = gql`
    subscription LISTEN_FOR_USERS {
        newUser{
            githubLogin
            name
            avatar
        }
    }
`;

export const LISTEN_FOR_PHOTOS = gql`
    subscription {
        newPhoto {
            id
            name
            url
        }
    }
`

// cache.writeQuery({ query: COMBINED_QUERY, data: { me: null, allUsers: [], totalUsers: 0, totalPhotos: 0 } });

// let dataR = cache.readQuery({ query: COMBINED_QUERY });
// console.log({dataR})
// console.log({me})
// console.log({ totalUsers })

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)