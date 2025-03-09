import { baseUrl } from "./shared.js";


const loginModal = document.querySelector('#login-modal')
const loginFormError = document.querySelector('.step-1-login-form__error')
const phoneNumberInput = document.querySelector(".phone_Number_input");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContainer = document.querySelector(".request_timer");
const requestTimer = document.querySelector(".request_timer span");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");


const submitPhoneNumber = async () => {
    const phoneRegex = RegExp(/^(09)[0-9]{9}$/);
    const phoneNumber = phoneNumberInput.value
    const isValidPhoneNumber = phoneRegex.test(phoneNumber)


    if (phoneNumber.length === 11) {
        if (isValidPhoneNumber) {
            loginFormError.innerHTML = ''
            // Send OTP Request to Backend
            const res = await fetch(`${baseUrl}/v1/auth/send`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: phoneNumber })
            })

            if (res.status === 200) {
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
            loginFormError.innerHTML = 'شماره تماس وارد شده معتبر نیست'
        }

    } else {
        loginFormError.innerHTML = 'شماره تماس باید 11 رقم باشد'
    }

}




export {
    submitPhoneNumber,
}