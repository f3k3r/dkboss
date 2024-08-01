import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function isLogin() {
    if (typeof window !== "undefined") {
      return localStorage.getItem('isLogin') !== null;
    }
    return false;
  }
  
  export function isAdmin() {
    if (typeof window !== "undefined") {
      return localStorage.getItem('isAdmin') === "true";
    }
    return false;
  }
  
  export function logout() {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
  
