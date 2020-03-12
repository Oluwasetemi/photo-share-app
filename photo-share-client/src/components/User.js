import React from 'react'
import { Query, Mutation, Subscription } from 'react-apollo';
import { ALL_USERS, ADD_FAKE_USER, COMBINED_QUERY, LISTEN_FOR_USERS } from '../index';

const Users = () => (
    <>
        <Query query={ALL_USERS}>
            {({ data, loading, error, refetch }) => {
                if (loading) return <p>Users are loading </p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                    <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
                )
            }}
        </Query>
        <Subscription subscription={LISTEN_FOR_USERS}>
            {({ data, loading }) => loading ? <p>loading a new user</p> :
                <div>
                    <h1>Subscription</h1>
                    <img src={data.newUser.avatar} width={48} height={48} alt={data.newUser.name} />
                    <h2>{data.newUser.name}</h2>
                </div>
        }
        </Subscription>
    </>
)

// using cache to do refetch
// const updateUserCache = (cache, { data: {addFakeUsers} }) => {
//     let data = cache.readQuery({ query: COMBINED_QUERY });
//     data.totalUsers += addFakeUsers.length;

//     data.allUsers = [
//         ...data.allUsers,
//         ...addFakeUsers,
//     ];
//     cache.writeQuery({ query: COMBINED_QUERY, data })
// }

const UserList = ({ count, users, refetchUsers }) => (
    <div>
        <p>{count}</p>
        <button type="button" onClick={() => refetchUsers()}>Refetch</button>
        <Mutation mutation={ADD_FAKE_USER} variables={{ count: 1 }} refetchQueries={[{query: COMBINED_QUERY}]}>
            {addFakeUsers => (
                <button type="button" onClick={addFakeUsers}>Add Fake Users</button>
            )}
        </Mutation>
        <ul>
            {
                users.map(user => (
                    <UserListItem key={user.id} name={user.name} avatar={user.avatar} />
                ))
            }
        </ul>
    </div>
)

const UserListItem = ({ name, avatar }) => (
    <li>
        <img src={avatar} width={48} height={48} alt={name} />
        <h2>{name}</h2>
    </li>
)


export default Users;