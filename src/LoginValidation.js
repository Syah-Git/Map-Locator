function LoginValidation(values) {
    let error = {}; // Object to store validation errors

    // Define patterns for validation
    const username_pattern = /^[a-zA-Z0-9_]{3,30}$/; // Username must be 3-30 characters long and can include letters, numbers, and underscores
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/; // Password must contain at least one uppercase, one lowercase, one digit, and be 8 characters long

    // Validate username
    if (values.username === "") {
        error.username = "Username should not be empty"; // Error if username is empty
    } else if (!username_pattern.test(values.username)) {
        error.username = "Username must be between 3 and 30 characters and can contain letters, numbers, and underscores"; // Error if username doesn't match the pattern
    } else {
        error.username = ""; // No error if validation passes
    }

    // Validate password
    if (values.password === "") {
        error.password = "Password should not be empty"; // Error if password is empty
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least one uppercase letter, one lowercase letter, and one digit, and be 8 characters long"; // Error if password doesn't match the pattern
    } else {
        error.password = ""; // No error if validation passes
    }

    return error; // Return the error object
}

export default LoginValidation;
