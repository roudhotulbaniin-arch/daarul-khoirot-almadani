import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.getElementById("btnLogin").addEventListener("click", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        alert("Login berhasil");

        await signInWithEmailAndPassword(auth, email, password);

        alert("Akan pindah ke dashboard");

        window.location.href = "dashboard.html";

    } catch (e) {

        alert(e.code + "\n\n" + e.message);

    }

});