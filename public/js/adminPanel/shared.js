import { logout } from "../../../utils/auth.js";
import { getMe, isLogin } from "../../../utils/utils.js"

window.addEventListener('load', async () => {

    const loading = document.querySelector('#loading-container')
    const phoneNumber = document.querySelector("#phone-number");
    const logoutBtn = document.querySelector(".logout");

    // Website Loader
    loading.style.display = 'none'

    const isUserLogin = await isLogin()
    if (isUserLogin) {
        getMe().then(user => {
            if (user.role === 'ADMIN') {
                location.href = '/pages/posts.html'
            }

            phoneNumber.innerHTML = user.phone
            logoutBtn.addEventListener('click', logout)

        })

    } else {
        location.href = '/pages/posts.html'
    }


})