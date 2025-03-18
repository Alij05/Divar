import { baseUrl } from "../../../utils/shared.js"
import { calculateRelativeTimeDifference, getToken, showSwal } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
    const postsContainer = document.querySelector("#posts-container")
    const emptyContainer = document.querySelector(".empty")


    //!  Functions


    const postGenerator = (posts) => {
        postsContainer.innerHTML = ''

        posts.map(post => {
            const date = calculateRelativeTimeDifference(post.createdAt)
            postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                    <div>
                        <div>
                            <a class="title" href="/pages/post.html?id=${post._id}">${post.title}</a>
                            <div>
                                <p>${post.price.toLocaleString()} تومان</p>
                                <p>${date} در ${post.neighborhood.name}</p>
                            </div>
                        </div>
                        ${post.pics.length ? `<img src="${baseUrl}/${post.pics[0].path}" />` : `<img src="/public/images/main/noPicture.PNG" />`
                }
                    </div>
                    <div>
                        <button >
                            اشتراک گذاری
                            <i class="bi bi-share"></i>
                        </button>
                        <button onclick="removeBookmark('${post._id}')">
                            حذف نشان
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>    
                    
                `)

        })

    }




    const token = getToken()

    const res = await fetch(`${baseUrl}/v1/user/bookmarks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const response = await res.json()
    let posts = response.data.posts

    if (posts.length) {
        postGenerator(posts)
    } else {
        emptyContainer.style.display = 'flex'
    }



    //! Bind Methods
    window.removeBookmark = async (postID) => {
        showSwal(
            "آیا از حذف این نشان مطمئن هستید؟",
            "warning",
            ["خیر", "بله"],
            (result) => {
                if (result) {
                    fetch(`${baseUrl}/v1/bookmark/${postID}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }

                    }).then(res => {
                        if (res.status === 200) {
                            posts = posts.filter(post => post._id !== postID)
                            if (posts.length) {
                                postGenerator(posts)
                            } else {
                                postsContainer.innerHTML = ''
                                emptyContainer.style.display = 'flex'
                            }
                        }
                    })
                }
            }
        )




    }



})