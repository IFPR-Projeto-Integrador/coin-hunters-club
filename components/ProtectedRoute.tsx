import { useAuth } from "@/context/authContext";
import { UserType } from "@/firebase/usuario/usuario";
import { Redirect, usePathname } from "expo-router";
import { PropsWithChildren, useEffect, useState } from "react";
import { Text } from "react-native";
import Loading from "./ui/Loading";
import headerConfig from "@/helper/headerConfig";

interface Props extends PropsWithChildren {}

export default function ProtectedRoute({ children }: Props) {
    const [user, loading] = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Redirect href="/" />;
    }

    return children;
}
