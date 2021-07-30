import {useCallback, useRef} from "react";
import validator from 'validator';

export type UseValidatorReturn = [(() => string[]), boolean, number, string];

function useValidatePassword(e): UseValidatorReturn {
    // const [error, setError] = useState<string[]>([])
    let errors = useRef<string[]>([])
    const Errors = useCallback(() => errors.current, []);
    const hasErrors = errors.current.length > 0;

    let passwordScore = useRef<number>(0)
    let passwordColor =  useRef<string>("progress progress-error")
    !validator.isStrongPassword(e.password, {minSymbols: 0}) && errors.current.push('Password needs at least 8 characters, 1 number, 1 lowercase and 1 uppercase.')
    // formData.password !== formData.password_confirmation && errors.push('Your password confirmation does not match.')
    // setError(errors)
    // return errors.length > 0;
    return [Errors, hasErrors, passwordScore.current, passwordColor.current];
}

export {
    useValidatePassword,
}