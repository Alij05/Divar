import { baseUrl } from "../../../utils/shared.js"
import { calculateRelativeTimeDifference, getParamFromURL, getToken, pagination, showSwal } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
    const postsContainer = document.querySelector("#posts-container")
    const emptyContainer = document.querySelector(".empty")
    const paginationItemsContainer = document.querySelector(".pagination-items");

    const token = getToken()
    let page = getParamFromURL('page')
    !page ? (page = 1) : null

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
                        <button onclick="sharePost('${post._id}', '${post.title}')">
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



    const res = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}&limit=4`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const response = await res.json()
    let posts = response.data.posts

    if (posts.length) {
        postGenerator(posts)
        pagination("/pages/userPanel/bookmarks.html", paginationItemsContainer, page, response.data.pagination.totalPosts, 4)

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

    window.sharePost = async (postID, postTitle) => {
        await navigator.share({ title: postTitle, url: `/pages/post.html?id=${postID}` })
    }

})