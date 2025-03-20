import { baseUrl } from "../../../utils/shared.js";
import { calculateRelativeTimeDifference, getFromLocalStorage, getToken, saveInLocalStorage } from "../../../utils/utils.js";

window.addEventListener('load', async () => {
    const postsContainer = document.querySelector("#posts-container");
    const emptyContainer = document.querySelector(".empty");

    let posts = []

    //!  Functions

    const postGenerator = () => {
        postsContainer.innerHTML = ''
        posts.map(post => {
            const date = calculateRelativeTimeDifference(post.createdAt)

            postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                    <div>
                    ${post.pics.length ? `<img src="${baseUrl}/${post.pics[0].path}" />` : `<img src="/public/images/main/noPicture.PNG" />`}
                        <div>
                            <a class="title" href="/pages/post.html?id=${post._id}">${post.title}</a>
                            <p>${date} در ${post.city.name}، ${post.neighborhood.id !== 0 ? post.neighborhood.name : ""}</p>
                        </div>
                    </div>
                    <i onclick="sahrePost('${post._id}', '${post.title}')" class="bi bi-share"></i>
                    <i onclick="removeRecentSeen('${post._id}')" class="bi bi-trash"></i>
                </div>      
                `)
        })
    }



    let recentSeens = getFromLocalStorage('recent-seens')
    if (recentSeens?.length) {
        for (const i in recentSeens) {
            const res = await fetch(`${baseUrl}/v1/post/${recentSeens[i]}`)
            const response = await res.json()
            posts.push(response.data.post)
        }

        postGenerator()

    } else {
        emptyContainer.style.display = "flex"
    }



    //! Bind Methods

    window.sahrePost = (postID, postTitle) => {
        navigator.share({title: postTitle, url: `/pages/post.html?id=${postID}`})
    }

    window.removeRecentSeen = (postID) => {
        recentSeens = recentSeens.filter(recentPostID => recentPostID !== postID)
        posts = posts.filter(post => post._id !== postID)

        if (recentSeens?.length) {
            saveInLocalStorage('recent-seens', recentSeens)
        } else {
            localStorage.removeItem('recent-seens')
            emptyContainer.style.display = "flex"
        }

        postGenerator()
    }


})