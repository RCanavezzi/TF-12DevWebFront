import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Button from "../Button/Button";
import "./styles.css";
import { CounterProps, CounterRef } from "./Counter.types";

export default forwardRef<CounterRef, CounterProps>(function Counter(props, ref) {
    const [quantity, setQuantity] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => {
        return {
            set: (value) => {
                setQuantity(value);
            }
        }
    });

    useEffect(() => {
        inputRef.current?.select();
    }, []);

    const addClickHandler = () => {
        setTimeout(() => {
            inputRef.current?.select();
        }, 0);
        setQuantity((prev) => {
            return ++prev;
        })
    }

    const subClickHandler = () => {
        setTimeout(() => {
            inputRef.current?.select();
        }, 0);
        setQuantity((prev) => {
            if (prev === 0) {
                return prev
            }
            return --prev;
        })
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const onlyNumber = target.value.replace(/[^\d]/g, "");
        const value = Number(onlyNumber || "0");
        setQuantity(value);
    };

    return (
        <>
            <div className="container d-flex justify-content-center my-4">
                <div className="d-flex align-items-center">
                    <div className="btn-group" role="group">
                        <Button onClick={subClickHandler} classList="bg-danger">
                            <i className="fa-solid fa-minus"></i>
                        </Button>
                        <input
                            type="text"
                            ref={inputRef}
                            className="form-control form-control-lg text-center"
                            value={quantity}
                            onChange={inputChangeHandler}
                        />
                        <Button onClick={addClickHandler}>
                            <i className="fa-solid fa-plus"></i>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
);