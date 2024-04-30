import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

export default function Validate(values) {

    const { state, setState } = useContext(AuthContext);
    const { user } = state;

    //local state
    const password = user?.password;
    const errors = {}

    if (!values.CurrentPassword) {
        errors.CurrentPassword = "Required";
    }
    else if (values.CurrentPassword !== password) {
        errors.CurrentPassword = 'Enter the Current Password Correctly';
    }

    if (!values.NewPassword) {
        errors.NewPassword = "Required";
    }
    else if (values.NewPassword.length < 8) {
        errors.NewPassword = "Password must be at least 8 characters long";
    }
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/.test(values.NewPassword)) {
        errors.NewPassword = "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one digit";
    }


    if (!values.ConfirmPassword) {
        errors.ConfirmPassword = "Required";
    }
    else if (values.NewPassword !== values.ConfirmPassword) {
        errors.ConfirmPassword = 'Password mismatch'
    }

    return errors;
}