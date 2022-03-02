function validateArgs(args) {
    const neededargs = ["name", "email", "firstName", "lastName", "password", "age"];
    if (args.length === 0 || args.length > 5) {
        return {
            isValid: false,
            message: 'Missing or too many arguments',
        }
    } else {
        for (let i = 0; i < neededargs.length; i++) {
            if (!args[neededargs[i]]) {
                return {
                    isValid: false,
                    message: `Missing argument ${neededargs[i]} or value is empty`,
                }
            }
        }

        if (isNaN(args.age)) {
            return {
                isValid: false,
                message: 'Age must be a number',
            }
        }
        return {
            isValid: true
        };
    }
}

module.exports = {
    validateArgs
};