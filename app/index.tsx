import Root from "@/components/Root";
import { useAuth } from "@/context/authContext";
import { UserType } from "@/firebase/usuario/usuario";
import IndexEmpresa from "./empresa";
import IndexCliente from "./cliente";
import IndexFuncionario from "./funcionario";
import React from "react";

export default function Index() {
    const [user, loading] = useAuth();

    if (loading) {
      return null;
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