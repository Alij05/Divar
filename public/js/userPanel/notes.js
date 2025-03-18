import { baseUrl } from "../../../utils/shared.js"
import { calculateRelativeTimeDifference, getToken, showSwal } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')


    //!  FUnctions

    const postGenerator = (posts) => {
        postsContainer.innerHTML = ''

        posts.map(post => {
            const date = calculateRelativeTimeDifference(post.createdAt)
            postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                    <div>
                        ${post.pics.length ? `<img src="${baseUrl}/${post.pics[0].path}" />` : `<img src="/public/images/main/noPicture.PNG" />`}
                        <div>
                            <a class="title" href="/pages/post.html?id=${post._id}">${post.title}</a>
                            <p>${date} در ${post.neighborhood.name}</p>
                            <p>${post.note.content}</p>
                        </div>
                    </div>
                    <i class="bi bi-trash" onclick=removeNote('${post.note._id}')></i>
                </div>    
                `)

        })

    }



    const token = getToken()

    const res = await fetch(`${baseUrl}/v1/user/notes`, {
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
    window.removeNote = (noteID) => {
        showSwal(
            "آیا از حذف این یادداشت مطمئن هستید؟",
            "warning",
            ["خیر", "بله"],
            (result) => {
                if (result) {
                    fetch(`${baseUrl}/v1/note/${noteID}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }

                    }).then(res => {
                        if (res.status === 200) {
                            posts = posts.filter(post => post.note._id !== noteID)
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