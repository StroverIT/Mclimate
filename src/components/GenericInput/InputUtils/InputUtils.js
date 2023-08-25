export const InputTypes = {
    SELECT: 'SELECT',
    SELECT_CREATABLE: 'SELECT_CREATABLE',
    TEXT_FIELD: 'TEXT_FIELD',
    TEXT_INPUT: 'TEXT_INPUT',
    DATE: 'DATE',
    CHECKBOX: 'CHECKBOX',
    BUTTON: 'BUTTON'
}

export default class InputUtils {
    static VALID_EMAIL_REGEX = "^[a-zA-Z0-9]([.!#$%&’*+\\/=?^_`{|}~-]?[a-zA-Z0-9]+)*@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|([a-zA-Z0-9]+([-][a-zA-Z0-9]+)*\\.([a-zA-Z0-9](-?[a-zA-Z0-9]+)*.)*[a-zA-Z]{2,}))$";
    static NON_EMPTY_STRING = ".*\\S.*";
    static MIN_SIX_SYMBOLS = "^.{6,}$";
    static DIGITS_ONLY = "^[0-9]*$";
    static POSITIVE_INTEGER = "^(\\s*|[1-9]\\d*)$";
    static POSITIVE_FLOAT = "^(?:[1-9]\\d*|0)?(?:\\.\\d+)?$";

    /**
     * Retrieve form with the new values
     *
     * @param key - key of the input - string
     * @param event
     * @param inputType - text,select,date
     * @param form - form object reference
     * @param isFormCopy - makes a copy of the passed to the function form
     * @returns Object - Form with the new assigned values
     */
    static inputOnChange = (key, event, inputType, form, isFormCopy) => {
        let eventValue;
        switch (inputType) {
            case InputTypes.SELECT:
                // eventValue = event !== null ? event : '';
                if (event && event.inputValue) {
                    eventValue = event.inputValue
                } else {
                    eventValue = event
                }
                break;
            case InputTypes.DATE:
                if (event) {
                    eventValue = new Date(event);
                } else {
                    eventValue = '';
                }
                break;
            case InputTypes.CHECKBOX:
                eventValue = event.target.checked
                break;
            default:
                eventValue = event.target.value ? event.target.value : '';
                break;
        }

        if (isFormCopy) {
            return {
                ...form,
                isFormValid: true,
                [key]: {
                    ...form[key],
                    value: eventValue,
                    valid: true
                }
            }
        } else {
            // uses the reference of the passed form object
            form[key].value = eventValue
            form[key].valid = true
            form.isFormValid = true;
            return form
        }
    }

    /**
     * Retrieve form with validated values
     *
     * @param form - form object reference
     * @returns Object - Form with the new assigned values
     */
    static checkFormValidity = (form) => {
        const keys = Object.keys(form);
        const formCopy = JSON.parse(JSON.stringify(form));
        keys.forEach((key) => {
            InputUtils.checkField(key, formCopy);
        })
        return formCopy
    }

    static checkField = (key, form) => {
        let inputValue = form[key].value;
        const inputRegex = form[key].regex;

        if (inputValue === null) {
            form[key].valid = false;
            form.isFormValid = false;
        } else if (inputRegex !== '' && inputValue !== undefined) {
            const regex = new RegExp(inputRegex);
            if (!regex.test(inputValue)) {
                form[key].valid = false;
                form.isFormValid = false;
            }
        } else if (form[key].minValue !== undefined || form[key].maxValue !== undefined) { // for input of type number
            if (typeof inputValue === 'string') {
                inputValue = parseInt(inputValue, 10);
            }
            if (form[key].minValue !== undefined ) {
                if (inputValue < form[key].minValue) {
                    form[key].valid = false;
                    form.isFormValid = false;
                }
            }
            if (form[key]?.maxValue !== undefined ) {
                if (inputValue > form[key]?.maxValue) {
                    form[key].valid = false;
                    form.isFormValid = false;
                }
            }
        }
    }

    /**
     * Retrieve form with validated values
     *
     * @param form - form object reference
     * @param key - key of the input - string
     * @returns Object - Form with the new assigned values
     */
    static checkFieldValidity = (key, form) => {
        const formCopy = JSON.parse(JSON.stringify(form));
        InputUtils.checkField(key, formCopy);
        return formCopy
    }
}