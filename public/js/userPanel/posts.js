import { baseUrl } from "../../../utils/shared.js"
import { calculateRelativeTimeDifference, getParamFromURL, getToken, pagination } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const paginationItemsContainer = document.querySelector(".pagination-items");

    let page = getParamFromURL('page')
    !page ? page = 1 : null


    const token = getToken()


    //!  Functions

    const generatePublishedPosts = (posts) => {
        postsContainer.innerHTML = ''

        posts.map(post => {
            const date = calculateRelativeTimeDifference(post.createdAt)

            postsContainer.insertAdjacentHTML('beforeend', `
                <a class="post" href="/pages/post.html?id=${post._id}">
                    <div class="post-info">
                        ${post.pics.length ? `<img src="${baseUrl}/${post.pics[0].path}" />` : `<img src="/public/images/main/noPicture.PNG" />`}
                        <div>
                            <p class="title">${post.title}</p>
                            <p class="price">${post.price.toLocaleString()} تومان</p>
                            <p class="location">${date} در ${post.city.name}</p>
                        </div>
                    </div>
                    <div class="post-status">
                        <div>
                            <p>وضعیت آگهی:</p>
                            ${post.status === "published" ? `<p class="publish">منتشر شده</p>` : ""}
                            ${post.status === "rejected" ? `<p class="reject">رد شده</p>` : ""}
                            ${post.status === "pending" ? `<p class="pending">در صف انتشار</p>` : ""}

                        </div>
                        <button class="controll-btn">مدیریت اگهی</button>
                    </div>
                </a>  
                `)
        })
    }




    const res = await fetch(`${baseUrl}/v1/user/posts?page=${page}&limit=1`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const response = await res.json()
    const posts = response.data.posts

    if (posts.length) {
        generatePublishedPosts(posts)
        pagination("/pages/userPanel/posts.html", paginationItemsContainer, page, response.data.pagination.totalPosts, 1)
    } else {

    }

})