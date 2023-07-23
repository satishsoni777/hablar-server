import { fileURLToPath } from 'url';
import path from 'path';
const filePath = path.join(__dirname, '../external_data/data.json');
// Get the current ES module file's URL and convert it to a file path
const currentFilePath = fileURLToPath(import.meta.url);

// Get the directory name of the current ES module file (project root)
const projectPath = path.dirname(currentFilePath);

console.log('Project path:', projectPath);
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