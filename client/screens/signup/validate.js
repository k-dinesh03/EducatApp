
export default function Validate(values) {

	const errors = {}

	if (!values.username) {
		errors.username = "Required";
	}
	else if (values.username.length < 4) {
		errors.username = "Username must be at least 4 characters long";
	}
	else if (!/^[a-z0-9_]{4,}$/i.test(values.username)) {
		errors.username = "Invalid Username";
	}


	if (!values.email) {
		errors.email = "Required";
	}
	else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = "Invalid Email address";
	}

	if (!values.userType) {
		errors.userType = "Required";
	}

	if (!values.password) {
		errors.password = "Required";
	}
	else if (values.password.length < 8) {
		errors.password = "Password must be at least 8 characters long";
	}
	else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/.test(values.password)) {
		errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one digit";
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = "Required";
	}
	else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = 'Password mismatch'
	}

	return errors;
}