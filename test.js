const whiteListing = [
    "/authentication/signIn",
    "/authentication/signUp",
    "/authentication/validateToken"
];
function succ(error) {
    error = { error: error }
    error.success = true;
    return error;
}



console.log(whiteListing.includes("/signIn"))
console.log(succ({
    "user": "asd",
    "error": "errorMessage",
}))