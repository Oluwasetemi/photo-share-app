const { request } = require('graphql-request');

const query = `
    query listUsers {
        allUsers {
            name
            avatar
        }
    }
`;

const mutation = `
    mutation populate($count: Int!) {
        addFakeUsers(count: $count) {
            id
            name
        }
    }
`;

const variables = { count: 3 };

// request('http://localhost:4000/graphql', query)
//   .then(data => console.log(JSON.parse(JSON.stringify(data))))
//   .catch(console.error);

request('http://localhost:4000/graphql', mutation, variables)
  .then(data => console.log(JSON.parse(JSON.stringify(data))))
  .catch(console.error);
