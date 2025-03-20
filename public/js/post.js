import { baseUrl, getPostDetails } from "../../utils/shared.js"
import { calculateRelativeTimeDifference, getFromLocalStorage, getParamFromURL, getToken, hideModal, isLogin, saveInLocalStorage, showModal, showSwal } from "../../utils/utils.js"

window.addEventListener('load', () => {

  getPostDetails().then(async (post) => {
    // Website Loader
    const loading = document.querySelector('#loading-container')
    loading.style.display = 'none'

    const isUserLogin = await isLogin()
    const token = getToken()

    const recentSeens = getFromLocalStorage('recent-seens')
    const isPostSeen = recentSeens?.some(postID => postID === post._id)

    if (!isPostSeen && recentSeens) {
      saveInLocalStorage('recent-seens', [...recentSeens, post._id])
    } else {
      if (recentSeens) {
        if (!isPostSeen) {
          saveInLocalStorage('recent-seens', [...recentSeens, post._id])
        }
      } else {
        saveInLocalStorage('recent-seens', [post._id])
      }
    }


    let noteID = null
    let bookmarkStatus = false

    const postTitle = document.querySelector('#post-title')
    const postDescription = document.querySelector('#post-description')
    const postLocation = document.querySelector('#post-location')
    const postBreadcrumb = document.querySelector('#breadcrumb')
    const shareIcon = document.querySelector('#share-icon')
    const postInfosList = document.querySelector('#post-infoes-list')
    const postPreview = document.querySelector("#post-preview");
    const mainSlider = document.querySelector("#main-slider-wrapper");
    const secondSlider = document.querySelector("#secend-slider-wrapper");
    const noteTextarea = document.querySelector("#note-textarea");
    const noteTrashIcon = document.querySelector("#note-trash-icon");
    const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");
    const phoneInfoBtn = document.querySelector("#phone-info-btn");
    const bookmarkIconBtn = document.querySelector("#bookmark-icon-btn");
    const bookmarkIcon = bookmarkIconBtn.querySelector(".bi");


    postTitle.innerHTML = post.title
    postDescription.innerHTML = post.description
    const date = calculateRelativeTimeDifference(post.createdAt)
    postLocation.innerHTML = `${date} در ${post.city.name} ${post.neighborhood ? `، ${post.neighborhood.name}` : ''}`

    postBreadcrumb.insertAdjacentHTML('beforeend', `
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">${post.title}</li>  
        `)

    postInfosList.insertAdjacentHTML('beforeend', `
          <li class="post__info-item">
            <span class="post__info-key">قیمت</span>
            <span class="post__info-value">${post.price.toLocaleString()} تومان</span>
          </li>
          `)

    post.dynamicFields.forEach(field => {
      postInfosList.insertAdjacentHTML('beforeend', `
            <li class="post__info-item">
              <span class="post__info-key">${field.name}</span>
              <span class="post__info-value">${typeof field.data === 'boolean' ? (field.data ? 'دارد' : 'ندارد') : field.data}</span>
            </li>
            `)
    })




    //! Events

    shareIcon.addEventListener('click', async () => {
      await navigator.share(location.href)
    })

    phoneInfoBtn.addEventListener('click', () => {
      showSwal(`
        شماره تماس : ${post.creator.phone}`,
        null,
        'تماس گرفتن',
        () => { }
      )
    })

    postFeedbackIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        postFeedbackIcons.forEach(icon => icon.classList.remove('active'))
        icon.classList.add('active')
      })
    })

    if (isUserLogin) {
      //* Note 

      // if there was a Note, Show Note in TextArea
      if (post.note) {
        noteID = post.note._id
        noteTextarea.value = post.note.content
        noteTrashIcon.style.display = 'block'
      }

      noteTextarea.addEventListener('keyup', event => {
        if (event.target.value.trim()) {
          noteTrashIcon.style.display = 'block'
        } else {
          noteTrashIcon.style.display = 'none'
        }

        noteTrashIcon.addEventListener('click', () => {
          noteTextarea.value = ''
          noteTrashIcon.style.display = 'none'
        })

      })

      // Save the User Note of Post
      noteTextarea.addEventListener('blur', async (event) => {
        // Edit an Existed Note
        if (noteID) {
          await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: event.target.value })
          })

          // Create a New Note for First Time
        } else {
          await fetch(`${baseUrl}/v1/note`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: post._id, content: event.target.value })
          })

        }

      })



      // * Bookmark
      if (post.bookmarked) {
        bookmarkStatus = true
        bookmarkIcon.style.color = 'red'
      } else {
        bookmarkStatus = false
      }

      bookmarkIconBtn.addEventListener('click', async () => {
        const postID = getParamFromURL('id')

        // if Exist Post in Bookmark,  Delete Post
        if (bookmarkStatus) {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })

          if (res.status === 200) {
            bookmarkStatus = false
            bookmarkIcon.style.color = 'gray'
          }

        } else {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })

          if (res.status === 201) {
            bookmarkStatus = true
            bookmarkIcon.style.color = 'red'

          }
        }


      })


    } else {
      noteTextarea.addEventListener('focus', (event) => {
        event.preventDefault()
        showModal('login-modal', 'login-modal--active')
      })

      bookmarkIconBtn.addEventListener('focus', (event) => {
        event.preventDefault()
        showModal('login-modal', 'login-modal--active')
      })

    }

    if (post.pics.length) {
      post.pics.map(pic => {
        mainSlider.insertAdjacentHTML('beforeend', `
          <div class="swiper-slide">
            <img src="${baseUrl}/${pic.path}" />
          </div>
          `)

        secondSlider.insertAdjacentHTML('beforeend', `
            <div class="swiper-slide">
              <img src="${baseUrl}/${pic.path}" />
            </div>
          `)
      })

    } else {
      postPreview.style.display = 'none'
    }

    const mainSliderConfigs = new Swiper(".mySwiper", {
      spaceBetween: 10,
      rewind: true,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const secondSliderConfigs = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      rewind: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      thumbs: {
        swiper: mainSliderConfigs,
      },
    });



  })

})