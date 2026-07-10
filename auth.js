import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { auth } from "firebase-config.js";

export function protectPage() {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location.replace("login.html");
            return;

        }

        const adminEmail = document.getElementById("adminEmail");

        if (adminEmail) {
            adminEmail.textContent = user.email;
        }

    });

}

export async function logout() {

    try {

        await signOut(auth);

        window.location.replace("login.html");

    } catch (err) {

        console.error(err);

        alert("Logout gagal.");

    }

}