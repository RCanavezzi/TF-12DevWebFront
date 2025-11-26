import { useEffect, useState } from "react";
import loginApi from "@app/js/services/api/loginApi";

export default function Login() {

    const [error, setError] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");

    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        //console.log(`Mudou email: ${email}`);

        return () => {
            //console.log("Desmontou");
        };
    }, [email]);

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(false);

        const data = await loginApi(email, password);

        if ("error" in data) {
            setError(true);
            return;
        }

        location.reload();
    };

    const changeEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    }

    const changePasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }

    console.log("render");

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-center">
                <div id="form-login" className="bg-white shadow-sm" >

                    <h2 className="h4 text-center mb-3">Entrar</h2>

                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                onChange={changeEmailHandler}
                                value={email}
                                type="email"
                                className="form-control"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input
                                onChange={changePasswordHandler}
                                value={password}
                                type="password"
                                className="form-control"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Entrar</button>

                        {error && (
                            <div className="card border-0 rounded-4 mt-3">
                                <div className="card-body py-3 bg-danger-subtle text-danger-emphasis rounded-4">
                                    <div className="d-flex align-items-center">
                                        <span className="me-2" aria-hidden="true">⚠️</span>
                                        <strong className="me-1">Login inválido.</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}