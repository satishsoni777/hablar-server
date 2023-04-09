import MojoAuth from "mojoauth-sdk";

const sendMojoOtp = async function (req, res) {
    const mojoauth = new MojoAuth("test-2cae39d4-6d10-43ed-8bc0-eadcc20b92d5", {
        language: "en",
        source: [{ type: "phone", feature: "otp" }],
    })
}

const MojoAuthentication = { sendMojoOtp }

export { MojoAuthentication };