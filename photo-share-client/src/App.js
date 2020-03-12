import React, {Component} from 'react';
import { withApollo } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom';
import Users from './components/User';
import AuthorizedUser from './components/AuthorizedUser';
import { LISTEN_FOR_USERS, COMBINED_QUERY, LISTEN_FOR_PHOTOS } from '../src/index'

class App extends Component {
    componentDidMount() {
        let { client } = this.props;
        this.listenForUsers = client
            .subscribe({ query: LISTEN_FOR_USERS })
            .subscribe(({ data: { newUser } }) => {
                const data = client.readQuery({ query: COMBINED_QUERY })
                data.totalUsers += 1;
                data.allUsers = [...data.allUsers, newUser]
                client.writeQuery({ query: COMBINED_QUERY, data })
            })
        this.listenForPhotos = client
            .subscribe({ query: LISTEN_FOR_PHOTOS })
            .subscribe(({ data:{ newPhoto } }) => {
                const data = client.readQuery({ query: COMBINED_QUERY })
                data.totalPhotos += 1
                data.allPhotos = [
                    ...data.allPhotos,
                    newPhoto
                ]
                client.writeQuery({ query: COMBINED_QUERY, data })
            })
    }

    componentWillUnmount() {
        this.listenForUsers.unsubscribe();
        this.listenForPhotos.unsubscribe();
    }


    render() {
        return (
            <BrowserRouter>
                <div>
                    <AuthorizedUser />
                    <Users />
                </div>
            </BrowserRouter>
        )
    }
}


export default withApollo(App);
