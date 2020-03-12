import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import { Mutation, Query, withApollo } from 'react-apollo';
import compose from 'lodash/flowRight'
import { GITHUB_AUTH_MUTATION, ALL_USERS, TOTAL_USER_PHOTO, ME, COMBINED_QUERY } from '../index';

const Me = ({ logout, requestCode, signingIn }) => (
    <>
        <Query query={{...ALL_USERS,...ME}} fetchPolicy="network-only">
            {({ loading, data, error }) => {
                if (loading) return <p>Users are loading </p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                    <div>
                        {data.me && <CurrentUser {...data.me} logout={logout} />}
                        { localStorage.getItem('token') && <p>Signed In</p> }
                        <button type="button" onClick={requestCode} disabled={signingIn || Boolean(localStorage.getItem('token'))}>
                            Sign In with Github
                        </button>
                    </div>
                )
            }}
        </Query>
    </>
)

const CurrentUser = ({ name, avatar, logout }) => (
    <div>
        <img src={avatar} width={48} height={48} alt="name" />
        <h1>{name}</h1>
        <button type="button" onClick={logout}>logout</button>
    </div>
)

class AuthorizedUser extends Component {
    state = { signingIn: false }

    componentDidMount() {
        if (window.location.search.match(/code=/)) {
            this.setState({ signingIn: true });
            const code = window.location.search.replace('?code=', "");
            this.githubAuthMutation({variables: {code}})
            this.props.history.replace('/');
        }
    }

    authorizationComplete = (cache, { data }) => {
        localStorage.setItem('token', data.githubAuth.token);
        this.props.history.replace('/');
        this.setState({ signingIn: false });
    }

    logout = () => {
        localStorage.removeItem('token');

        let data = this.props.client.readQuery({ query: COMBINED_QUERY });
        data.me = null;
        this.props.client.writeQuery({ query: COMBINED_QUERY, data})
    }

    requestCode() {
        let clientID = 'a03dd65045e97ab0db74';
        window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
    }
    render() {
        return (
            <Mutation mutation={GITHUB_AUTH_MUTATION} update={this.authorizationComplete} refetchQueries={[{ query: ALL_USERS }, { query: TOTAL_USER_PHOTO }, { query: ME }]} >
                {mutation => {
                    this.githubAuthMutation = mutation
                    return (
                        <Me signingIn={this.state.signingIn} requestCode={this.requestCode} logout={this.logout} />
                    )
                }}
            </Mutation>
        )
    }
}

export default compose(withApollo, withRouter)(AuthorizedUser)
