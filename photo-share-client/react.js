// import React from 'react';
// import ReactDOM from 'react-dom';
// import { request } from 'graphql-request';

// const url = 'localhost:4000/graphql';

// const query = `
//     query listUsers {
//         allUsers {
//             name
//             avatar
//         }
//     }
// `;

// const mutation = `
//     mutation populate($count: Int!) {
//         addFakeUsers(count: $count) {
//             id
//             name
//         }
//     }
// `;

// const App = ({ users = [] }) => (
//   <div>
//     {users.map(user => (
//       <div key={user.id}>
//         <img src={user.avatar} alt={user.githubLogin} />
//         {user.name}
//       </div>
//     ))}
//     <button onClick={addUser} type="submit">
//       Add User
//     </button>
//   </div>
// );

// const render = ({ allUsers = [] }) =>
//   ReactDOM.render(<App users={allUsers} />, document.getElementById('root'));

// const addUser = () =>
//   request(url, mutation, { count: 1 })
//     .then(requestAndRender)
//     .catch(console.error);

// const requestAndRender = () =>
//   request(url, query)
//     .then(render)
//     .catch(console.error);

// requestAndRender();
