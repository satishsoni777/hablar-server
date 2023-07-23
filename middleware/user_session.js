const whiteListing = () => [
    "/authentication/signIn",
    "/authentication/signUp",
    "/authentication/validateToken",
    "/init/init_data"
];

function getUserId(req) {
    return req.session.userId
}

const UserSession = { getUserId, whiteListing };

export { UserSession }