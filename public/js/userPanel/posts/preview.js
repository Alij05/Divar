import { baseUrl } from "../../../../utils/shared.js"
import { getParamFromURL, getToken, showSwal } from "../../../../utils/utils.js"


window.addEventListener('load', async () => {

    const postTitle = document.querySelector('#post-title')
    const postLocation = document.querySelector('#post-location')
    const postPrice = document.querySelector('#post-price')
    const postInfoesList = document.querySelector('#post-infoes-list')
    const postDescription = document.querySelector('#post-description')
    const previewMap = document.querySelector('#preview-map')
    const deleteBtn = document.querySelector('.delete-btn')


    const postID = getParamFromURL('id')
    const token = getToken()
    const res = await fetch(`${baseUrl}/v1/post/${postID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const response = await res.json()
    const post = response.data.post
    console.log(post);


    postTitle.innerHTML = `نام آگهی : ${post.title}`
    postLocation.innerHTML = `شهر : ${post.city.name}`
    postPrice.innerHTML = `قیمت : ${post.price.toLocaleString()} تومان`
    postDescription.innerHTML = `توضحیحات آگهی : ${post.description}`
    postInfoesList.innerHTML = `دسته بندی : ${post.breadcrumbs.category.title} > ${post.breadcrumbs.subCategory.title} > ${post.breadcrumbs.subSubCategory.title}`
    previewMap.insertAdjacentHTML('beforeend', `
        ${post.pics.length ? `<img src="${baseUrl}/${post.pics[0].path}" width=400px; height=300px;/>` : `<img src="/public/images/main/noPicture.PNG" />`}
        `)


    //! Events

    deleteBtn.addEventListener('click', async (event) => {

        showSwal(
            "آیا از حذف این آگهی مطمئن هستید؟",
            "warning",
            ["خیر", "بله"],
            (result) => {
                if (result) {
                    fetch(`${baseUrl}/v1/post/${postID}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(res => {
                        if (res.status === 200) {
                            showSwal('آگهی مورد نظر با موفقیت حذف شد ', 'success', 'همه آگهی ها', () => {
                                location.href = '.././posts.html'
                            })
                        }
                    })
                }
            }
        )


    })

})