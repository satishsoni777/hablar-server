const whiteListing = () => [
    "/authentication/signIn",
    "/authentication/signUp"
];

function getUserId(req, res, next) {
    return req.session.userId
}

const userSession = { getUserId, whiteListing };

export { userSession }