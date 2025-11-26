import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { ButtonProps, ButtonRef } from "./Button.types";

const Button = forwardRef<ButtonRef, ButtonProps>(({ children, onClick, classList = "" }, ref) => {

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.();
    }

    useImperativeHandle(ref, () => {
        return {
            disable() {
                setIsDisabled(true);
            },
            enable() {
                setIsDisabled(false);
            }
        }
    });

    const buttonClasses = [
        "btn",
        "btn-primary",
        "btn-lg",
        "px-4",
        classList
    ];

    return (
        <button
            disabled={isDisabled}
            className={buttonClasses.join(" ")}
            onClick={clickHandler}
        >
            {children}
        </button>
    );

});

export default Button;