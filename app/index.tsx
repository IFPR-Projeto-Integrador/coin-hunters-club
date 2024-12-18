import Root from "@/components/Root";
import { useAuth } from "@/context/authContext";
import { UserType } from "@/firebase/user/user";
import IndexEmpresa from "./company";
import IndexCliente from "./client";
import IndexFuncionario from "./employee";
import React from "react";
import Loading from "@/components/ui/Loading";

export default function Index() {
    const [user, loading] = useAuth();

    if (loading) {
      return <Loading />;
    }

    let screen: React.JSX.Element | null = null;

    if (user?.tipoUsuario === UserType.EMPRESA) {
        screen = <IndexEmpresa />
    }
    if (user?.tipoUsuario === UserType.CLIENTE) {
        screen = <IndexCliente />
    }
    if (user?.tipoUsuario === UserType.FUNCIONARIO) {
        screen = <IndexFuncionario />
    }

    return (
        <Root requireAuth={true}>
            { screen }
        </Root>
    )
}