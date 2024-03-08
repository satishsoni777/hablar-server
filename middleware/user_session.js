const whiteListing = () => [
    "/authentication/v1/signIn",
    "/authentication/v1/signin",
    "/authentication/v1/signup",
    "/authentication/v1/validateToken",
    "/authentication/v1/validate_token",
    "/init/v1/init_data",
    "/users/v1/get_token",
    "/agora/v1/rtc_token"
];

function getUserId(req) {
    return req.session.userId
}

const UserSession = { getUserId, whiteListing };

export { UserSession }