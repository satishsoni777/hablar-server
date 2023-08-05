const whiteListing = () => [
    "/authentication/signIn",
    "/authentication/signin",
    "/authentication/signUp",
    "/authentication/signup",
    "/authentication/validateToken",
    "/authentication/validate_token",
    "/init/init_data",
    "/users/get_token",
    "/agora/rtc_token"
];

function getUserId(req) {
    return req.session.userId
}

const UserSession = { getUserId, whiteListing };

export { UserSession }