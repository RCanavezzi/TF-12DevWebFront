import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { InputTextProps, InputTextRef } from "./InputText.types";
import { DEBOUNCE_MILISECONDS } from "@app/js/constants";

export default forwardRef<InputTextRef, InputTextProps>(function InputText({ onChange, value = "" }, ref) {

    const [inputValue, setInputValue] = useState<string>(value);

    const timerRef = useRef<number>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useImperativeHandle(ref, () => {
        return {
            set: (value: string) => {
                setInputValue(value);
            }
        }
    });

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onChange?.(inputValue);
        }, 0);

        return () => {
            (timerRef.current !== null) && clearTimeout(timerRef.current);
        }
    }, [inputValue]);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value ?? "";
        setInputValue(value);
    }

    return (
        <input
            type="text"
            className="form-control form-control-lg text-center"
            value={inputValue}
            onChange={inputChangeHandler}
        />
    );
});
