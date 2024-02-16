
export default function postValidate(values) {

    const errors = {}

    if (!values.media) {
        errors.media = "Required";
    }
    if (!values.title) {
        errors.title = "Required";
    }
    if (!values.subtitle) {
        errors.subtitle = "Required";
    }
    if (!values.description) {
        errors.description = "Required";
    }

    return errors;
}