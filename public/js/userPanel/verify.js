//* Verifying the NationalID in Backend :
//*  1) 10 digit  (Front)
//*  2) the Last 2 Digit of NationalID Should Equal wiht Last 2 Digit of Phone Number (Back)
//*

import { baseUrl } from "../../../utils/shared.js"
import { getMe, getToken } from "../../../utils/utils.js"


window.addEventListener('load', () => {
    const token = getToken()

    const phoneNumber = document.querySelector('#phone-number')
    const verifyInput = document.querySelector('#verify-input')
    const verifyBtn = document.querySelector('#verify-btn')
    const verifyError = document.querySelector('#verify-error')
    const verifyContainer = document.querySelector('#verify-container')


    getMe().then(user => {
        phoneNumber.innerHTML = user.phone

        if (user.verified) {
            verifyContainer.innerHTML = ''
            verifyContainer.insertAdjacentHTML('beforeend', `
                <div class="verified">
                    <p>تأیید هویت شده</p>
                    <span>تأیید هویت شما در فروردین ۱۴۰۳ از طریق کد ملی انجام شد.</span>
                    <img width="100" height="100" src="https://img.icons8.com/ios/100/approval--v1.png" alt="approval--v1"/>
                </div>   
                `)
        }
    })


    verifyBtn.addEventListener('click', () => {
        const nationalIDRegex = new RegExp(/^[0-9]{10}/)
        const nationalID = verifyInput.value.trim()
        const notionalCodeResult = nationalIDRegex.test(nationalID)

        if (notionalCodeResult) {
            fetch(`${baseUrl}/v1/user/identity`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nationalCode: nationalID })

            }).then(res => {
                if (res.status === 200) {
                    verifyError.style.display = "none"
                    verifyContainer.innerHTML = ''
                    verifyContainer.insertAdjacentHTML('beforeend', `
                        <div class="verified">
                            <p>تأیید هویت شده</p>
                            <span>تأیید هویت شما در فروردین ۱۴۰۳ از طریق کد ملی انجام شد.</span>
                            <img width="100" height="100" src="https://img.icons8.com/ios/100/approval--v1.png" alt="approval--v1"/>
                        </div>   
                    `)

                } else {
                    verifyError.style.display = "flex"
                }
            })

        } else {
            verifyError.style.display = "flex"
        }

    })



})