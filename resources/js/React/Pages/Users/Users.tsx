import { useEffect, useState } from "react";
import axios from "axios";
import { ListApi, UserModel } from "@app/js/app.types";

export default function Users() {

    const [data, setData] = useState<ListApi<UserModel>>();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get<ListApi<UserModel>>("http://localhost:8080/api/users");

            setData(data);
        })();
    }, []);

    return (
        <ul>
            {data && data.rows.map((userModel) => {
                return (
                    <li>{userModel.name}</li>
                )
            })}
        </ul>
    )
}