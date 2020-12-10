
const getLoginStatus = async(session) => {
    const login = {
        auth: await session.get('auth'),
        user: await session.get('user')
    };
    if (typeof login.auth === "undefined" ) {
        login.auth = null;
        login.user = null;
    }
    return login;
}

export {getLoginStatus};