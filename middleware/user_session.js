const whiteListing = () => [
    "/authentication/signIn",
    "/authentication/signUp",
    "/authentication/validateToken"
];

function getUserId(req) {
    return req.session.userId
}

const UserSession = { getUserId, whiteListing };

export { UserSession }