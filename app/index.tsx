import Root from "@/components/Root";
import { useAuth } from "@/context/authContext";
import { UserType } from "@/firebase/user/user";
import IndexCompany from "./company";
import IndexClient from "./client";
import IndexEmployee from "./employee";
import React from "react";
import Loading from "@/components/ui/Loading";
import { Redirect } from "expo-router";
import { Paths } from "@/constants/Paths";

export default function Index() {
    const [user, loading] = useAuth();

    if (loading) {
      return <Loading />;
    }

    if (!user) {
        return <Redirect href={Paths.LOGIN}/>
    }

    let screen: React.JSX.Element | null = null;

    // RN 05 - Promoções serão mantidas apenas por empresas (Apenas elas possuem acesso as telas)
    // RN 08 - Apenas a empresa pode definir o limite por pessoa (E apenas a empresa, já que apenas ela tem acesso a essa tela)
    // RN 23 - Apenas empresas podem cadastrar funcionários, pois apenas as funções chamadas por essa tela podem criar um usuário com 
    // tipo de usuário FUNCIONÁRIO.
    if (user?.tipoUsuario === UserType.EMPRESA) {
        screen = <IndexCompany />
    }
    // RN 10 - Apenas clientes podem criar e resgatar recompensas, pois apenas eles tem acesso as telas para isso.
    // RN 11 - Apenas clientes podem receber coins, pois apenas as funções chamadas por essa tela podem criar uma carteira para o usuário.
    // RN 16 - Apenas clientes podem gerar códigos de resgate, pois apenas as funções chamadas por essa tela podem criar um código de resgate para um usuário.
    // RN 25 - Apenas clientes podem visualizar o leaderboard, pois é possível acessar ele apenas por meio desta tela.
    if (user?.tipoUsuario === UserType.CLIENTE) {
        screen = <IndexClient />
    }
    // RN 15 - Apenas funcionários podem creditar coins, pois apenas as funções chamadas por essa tela podem creditar coins para um usuário.
    // RN 18 - Apenas funcionários podem resgatar reservas, pois apenas as funções chamadas por essa tela podem resgatar reservas para um usuário.
    if (user?.tipoUsuario === UserType.FUNCIONARIO) {
        screen = <IndexEmployee />
    }

    return (
        <Root accountButton requireAuth>
            { screen }
        </Root>
    )
}