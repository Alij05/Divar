import { baseUrl } from "../../../utils/shared.js"
import { getParamFromURL, getToken, pagination } from "../../../utils/utils.js"


window.addEventListener('load', async () => {

    let page = getParamFromURL('page')
    !page ? page = 1 : null

    const postsTable = document.querySelector("#posts-table");
    const paginationItemsContainer = document.querySelector(".pagination-items");
    const emptyContainer = document.querySelector(".empty");


    const token = getToken()

    const postGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/post/all?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const response = await res.json()
        const posts = response.data.posts

        if (posts.length) {
            pagination('/pages/adminPanel/posts.html', paginationItemsContainer, page, response.data.pagination.totalPosts, 10)
            postsTable.insertAdjacentHTML(
                `beforeend`,
                `
                    <tr>
                        <th>عنوان</th>
                        <th>کاربر</th>
                        <th>وضعیت</th>
                        <th>تایید</th>
                        <th>رد</th>
                        <th>حذف</th>
                    </tr>

                    ${posts.map((post) => `
                        <tr>
                            <td>${post.title}</td>
                            <td>${post.creator.phone}</td>
                            <td>
                                ${post.status === "published" ? `<p class="publish">منتشر شده</p>` : ""}
                                ${post.status === "rejected" ? `<p class="reject">رد شده</p>` : ""}
                                ${post.status === "pending" ? `<p class="pending">در صف انتشار</p>` : ""}
                            </td>
                            <td>
                                ${post.status === "published" || post.status === "rejected" ? "❌" : `<button class="edit-btn" onclick="acceptPost('${post._id}')">تایید</button>`}
                            </td>
                            <td>
                                ${post.status === "published" || post.status === "rejected" ? "❌" : `<button class="edit-btn" onclick="rejectPost('${post._id}')">رد</button>`}
                            </td>
                            <td>
                                <button class="delete-btn" onclick="deletePost('${post._id}')">حذف</button>
                            </td>
                        </tr>
                    `
                )
                    .join("")}
                `
            )

        } else {
            emptyContainer.style.display = 'flex'
        }

    }

    // Call the Method
    await postGenerator()




})