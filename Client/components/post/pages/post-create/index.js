import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { RxCross2, RxPlus } from 'react-icons/rx'
import { PiPlusThin } from 'react-icons/pi'
import { array } from 'prop-types'
import { set, update } from 'lodash'
import axios from 'axios'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import { sub } from 'date-fns'
import styles from './index.module.scss'

export default function Index(props) {
  const [imgs, setImgs] = useState([])

  const [TitleFocus, setTitleFocus] = useState(false)
  const [ContentFocus, setContentFocus] = useState(false)
  const [tagFocus, setTagFocus] = useState(false)

  const [title, setTitle] = useState('')
  const [titleLength, setTitleLength] = useState('')
  const [content, setContent] = useState('')
  const [contentLength, setContentLength] = useState('')

  const [tagInput, setTagInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const inputRef = useRef(null)

  let draggedItemIndex = null

  //img upload
  const inputHandle = () => {
    inputRef.current.click()
  }
  //img upload show
  const showHandle = (e) => {
    const files = Array.from(e.target.files)
    if (e.target.files.length + imgs.length > 5) {
      Swal.fire({
        html: `
                  <div class="custom-alert-content">
                    <span class="custom-icon">❌</span>
                    <span>請勿上傳超過5張圖片</span>
                  </div>
                `,
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      })
      return
    }
    const nextImgs = files.map((file) => URL.createObjectURL(file))
    setImgs((prevImgs) => [...prevImgs, ...nextImgs])
  }
  //delete img
  const deleteImg = (index) => {
    if (imgs.length === 1) {
      Swal.fire({
        html: `
              <div class="custom-alert-content">
                <span class="custom-icon">❌</span>
                <span>請至少上傳一張圖片</span>
              </div>
            `,
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      })

      return
    }
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index))
  }
  const deleteTag = (index) => {
    setSelectedTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }
  //img drag
  //拖曳圖片的索引
  const dragStartHandle = (index) => {
    draggedItemIndex = index
  }
  const dragEndHandle = () => {
    draggedItemIndex = null //不會判斷是否有放入正確
  }
  const dropHandle = (e, dropIndex) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return
    const newImgs = [...imgs]
    const draggedItem = newImgs[draggedItemIndex] //賦值 拖曳圖片在新陣列中的位置
    newImgs.splice(draggedItemIndex, 1)
    newImgs.splice(dropIndex, 0, draggedItem)
    setImgs(newImgs)
    draggedItemIndex = null
  }
  // title & content
  const titleHandle = (e) => {
    setTitle(e.target.value)
    setTitleLength(e.target.value.length)
  }
  const contentHandle = (e) => {
    setContent(e.target.value)
    setContentLength(e.target.value.length)
  }
  const addTagHandle = (e, tag) => {
    e.preventDefault()
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput('')
  }
  //動態搜尋
  useEffect(() => {
    if (tagInput) {
      const fetchTags = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/api/post/tags?tagInput=${tagInput}`
          )
          setSuggestedTags(response.data)
        } catch (error) {
          console.error('Failed to fetch tags:', error)
        }
      }
      fetchTags()
    } else {
      setSuggestedTags([])
    }
  }, [tagInput])

  const submitHandle = async (e) => {
    e.preventDefault()
    // Verify form

    // Collect form
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    for (let i = 0; i < imgs.length; i++) {
      formData.append('files', imgs[i])
    }
    for (let i = 0; i < selectedTags.length; i++) {
      formData.append('tags', selectedTags[i])
    }

    // Submit form
    try {
      const response = await fetch(
        'http://localhost:3005/api/post/post_create',
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      )
      if (response.ok) {
        // 成功處理後的操作
        alert('表單提交成功！')
      } else {
        alert('提交失敗，請再試一次！')
      }
    } catch (error) {
      console.error('提交錯誤:', error)
      alert('提交錯誤，請再試一次！')
    }
  }
  return (
    <>
      <UserSection titleCN="我的貼文" titleENG="My Post">
        <form className={styles['post-form']}>
          <div className={styles['post-content']}>
            {/* 圖片編輯 */}
            <div className={styles['post-img']}>
              <div className={`${styles['img-amount']} h5`}>
                <div>圖片編輯</div>
                <div>({imgs.length}/5)</div>
                <input
                  ref={inputRef}
                  type="file"
                  name="files"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={showHandle}
                />
              </div>
              <div className={styles['img-area']}>
                <div
                  className={styles['img-upload-area']}
                  onClick={inputHandle}
                >
                  <span className="h3">+</span>
                  <span>添加</span>
                </div>
                <div className={styles['img-preview-area']}>
                  <div className={styles['img-container']}>
                    {/* map上傳的圖片 */}
                    {imgs.map((src, index) => (
                      //eslint-disable-next-line
                        <div className={styles['image-wrapper']}
                        key={index}
                        draggable
                        onDragStart={() => dragStartHandle(index)}
                        onDragEnd={dragEndHandle}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => dropHandle(e, index)}
                      >
                        <Image src={src} width={98} height={98} alt="image" />
                        {/* //eslint-disable-next-line */}
                        <div
                          className={styles['delete-btn']}
                          onClick={() => deleteImg(index)}
                        >
                          <RxCross2 size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* 貼文內容 */}
            <div className={styles['post-publish']}>
              <div className={`${styles['publish-title']} h5`}>分享內容</div>
              <div className={styles['publish-info']}>
                <div
                  className={`${styles['info-title']} ${
                    styles[TitleFocus ? 'focused' : '']
                  }`}
                  onFocus={() => setTitleFocus(true)}
                  onBlur={() => setTitleFocus(false)}
                >
                  <input
                    type="text"
                    name="title"
                    placeholder="標題"
                    value={title}
                    onChange={titleHandle}
                  />
                  <div className={styles['count-tip']}>
                    {titleLength == 0 ? 0 : titleLength}/20
                  </div>
                </div>
                <div>
                  <div
                    className={`${styles['info-content']} ${
                      styles[ContentFocus ? 'focused' : '']
                    }`}
                    onFocus={() => setContentFocus(true)}
                    onBlur={() => setContentFocus(false)}
                  >
                    <textarea
                      type="text"
                      name="content"
                      placeholder="內文"
                      value={content}
                      onChange={contentHandle}
                      className={styles['post-editor']}
                    ></textarea>
                    <div className={styles['count-tip']}>
                      {contentLength == 0 ? 0 : contentLength}/1000
                    </div>
                  </div>
                </div>
                <div className={styles['info-tag']}>
                  <div
                    className={`${styles['tag-input']} 
                    ${tagFocus ? styles['focused'] : ''}`}
                    onFocus={() => setTagFocus(true)}
                    onBlur={() => setTagFocus(false)}
                  >
                    <input
                      type="text"
                      name="tags"
                      placeholder="#標籤"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button
                      className={styles['tag-add']}
                      onClick={(e) => addTagHandle(e, tagInput)}
                    >
                      <RxPlus size={24} />
                    </button>
                  </div>

                  {/* show tags selected */}
                  <div className={styles['selected-tags']}>
                    {selectedTags.map((tag, index) => (
                      <button key={index} onClick={(e) => e.preventDefault()}>
                        {tag}
                        <div onClick={() => deleteTag(index)}>
                          <RxCross2 size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* show tags suggested */}
                  <div className={styles['suggested-tags']}>
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={(e) => addTagHandle(e, tag.name)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 按鈕 */}
          <div className={styles['post-btn']}>
            <button className="btn-primary h6" type="submit">
              發布
            </button>
            <Link href="/user/post" className={`btn-secondary ${styles['']}`}>
              取消
            </Link>
          </div>
        </form>
      </UserSection>
    </>
  )
}
