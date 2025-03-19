import { baseUrl } from "./shared.js";
import { hideModal, saveInLocalStorage, showSwal } from "./utils.js";


const loading = document.querySelector('#loading-container')
const loginModal = document.querySelector('#login-modal')
const step1LoginFormError = document.querySelector('.step-1-login-form__error')
const step2LoginFormError = document.querySelector('.step-2-login-form__error')
const phoneNumberInput = document.querySelector(".phone_Number_input");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContainer = document.querySelector(".request_timer");
const requestTimer = document.querySelector(".request_timer span");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const otpInput = document.querySelector(".code_input");


const submitPhoneNumber = async () => {
    // Show Website Loading
    loading.classList.add('active-login-loader')

    const phoneRegex = RegExp(/^(09)[0-9]{9}$/);
    const phoneNumber = phoneNumberInput.value
    const isValidPhoneNumber = phoneRegex.test(phoneNumber)


    if (phoneNumber.length === 11) {
        if (isValidPhoneNumber) {
            step1LoginFormError.innerHTML = ''
            // Send OTP Request to Backend
            const res = await fetch(`${baseUrl}/v1/auth/send`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: phoneNumber })
            })

            if (res.status === 200) {
                loading.classList.remove('active-login-loader')
                loginModal.classList.add('active_step_2')
                userNumberNotice.innerHTML = phoneNumber
                reqNewCodeBtn.style.display = 'none'

                let count = 5
                requestTimerContainer.style.display = 'flex'
                requestTimer.textContent = count

                let timer = setInterval(() => {
                    count--
                    requestTimer.textContent = count

                    if (count === 0) {
                        clearInterval(timer)
                        reqNewCodeBtn.style.display = 'block'
                        requestTimerContainer.style.display = 'none'
                    }

                }, 1000)
            }

        } else {
            step1LoginFormError.innerHTML = 'شماره تماس وارد شده معتبر نیست'
            loading.classList.remove('active-login-loader')
        }

    } else {
        step1LoginFormError.innerHTML = 'شماره تماس باید 11 رقم باشد'
        loading.classList.remove('active-login-loader')
    }

}


const verifyOTP = async () => {
    // Show Website Loading
    loading.classList.add('active-login-loader')

    const otpRegex = RegExp(/^\d{4}$/)
    const userOtp = otpInput.value
    const isValidOTP = otpRegex.test(userOtp)

    if (isValidOTP) {
        step2LoginFormError.innerHTML = ''

        const res = await fetch(`${baseUrl}/v1/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: phoneNumberInput.value, otp: userOtp })
        })

        if (res.status === 200 || res.status === 201) {
            const response = await res.json()
            saveInLocalStorage('token', response.data.token)

            loading.classList.remove('active-login-loader')
            hideModal("login-modal", "login-modal--active");
            showSwal(
                "لاگین با موفقیت انجام شد",
                "success",
                "ورود به پنل کاربری",
                () => (location.href = "/pages/userPanel/verify.html")
            );

        } else if (res.status === 400) {
            loading.classList.remove("active-login-loader");
            otpInput.value = "";
            step2LoginFormError.innerHTML = "کد وارد شده نامعتبر هست";
        }

    } else {
        step2LoginFormError.innerHTML = 'کد وارد شده نامعتبر است'
        loading.classList.remove('active-login-loader')
    }


}


const requestNewOTP = async () => {
    // Show Website Loading
    loading.classList.add('active-login-loader')

    const phoneNumber = phoneNumberInput.value

    const res = await fetch(`${baseUrl}/v1/auth/send`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone: phoneNumber })
    })

    if (res.status === 200) {
        loading.classList.remove('active-login-loader')
        reqNewCodeBtn.style.display = 'none'

        let count = 5
        requestTimerContainer.style.display = 'flex'
        requestTimer.textContent = count

        let timer = setInterval(() => {
            count--
            requestTimer.textContent = count

            if (count === 0) {
                clearInterval(timer)
                reqNewCodeBtn.style.display = 'block'
                requestTimerContainer.style.display = 'none'
            }

        }, 1000)
    }
}


const logout = async () => {
    showSwal("آیا از خروج از حساب کاربری خود مطمئن هستید؟", "warning", ["خیر", "بله"], (result) => {
        if (result) {
            localStorage.removeItem("token");
            showSwal("با موفقیت خارج شدید", "success", "رفتن به هوم پیج", () => {
                location.href = "/index.html";
            });
        }
    });

}


export {
    submitPhoneNumber,
    verifyOTP,
    requestNewOTP,
    logout,
}