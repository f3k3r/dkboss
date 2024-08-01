'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../include/auth";

export default function Login() {
    const router = useRouter();
    useEffect(()=>{
        localStorage.clear();
        router.push("/login");
    })

}
