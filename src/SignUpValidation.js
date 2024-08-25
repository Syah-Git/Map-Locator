function SignUpValidation(values) {
    let error = {}; // Object to store validation errors

    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/; // Password pattern: at least one uppercase, one lowercase, one digit, and be 8 characters long

    // Validate name
    if (values.name === "") {
        error.name = "Name should not be empty"; // Error if name is empty
    } else {
        error.name = ""; // No error if validation passes
    }

    // Validate username
    if (values.username === "") {
        error.username = "Username should not be empty"; // Error if username is empty
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

    // Validate confirm password
    if (values.confirmPassword !== values.password) {
        error.confirmPassword = "Passwords must match"; // Error if confirm password doesn't match the password
    } else {
        error.confirmPassword = ""; // No error if validation passes
    }

    return error; // Return the error object
}

export default SignUpValidation;
