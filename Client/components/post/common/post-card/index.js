import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Carousel from 'react-bootstrap/Carousel'
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// 在 index.js 或 App.js 文件中引入
import 'bootstrap/dist/css/bootstrap.min.css'

import {
  PiHeartStraight,
  PiHeartStraightFill,
  PiChatCircle,
} from 'react-icons/pi'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'

import styles from './index.module.scss'
import ReplyInfo from '../reply-info'
export default function PostCard1({
  title,
  content,
  tags,
  postCreateTime,
  likeCount,
  commentCount,
  postImage,
  authorAvatar,
  authorName,
  commentAuthorAvatar,
  commentAuthorName,
  commentCreateTime,
  commentContent,
  commentLikeCount,
  commentReplyCount,
}) {
  const [active, setActive] = useState({})
  const icons = [
    {
      id: 1,
      default: <FgThumbsUp height="26" width="26" fill="#8A8A8A" />,
      active: <FgThumbUpFill height="26" width="26" fill="#8A8A8A" />,
    },
    {
      id: 2,
      default: <PiHeartStraight size={26} fill="#8A8A8A" />,
      active: <PiHeartStraightFill size={26} fill="#963827" />,
    },
    {
      id: 3,
      default: <PiChatCircle size={26} fill="#8A8A8A" />,
      active: <PiChatCircle size={26} fill="#8A8A8A" />,
    },
  ]
  const [inputValue, setInputValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [user, setUser] = useState('')
  const [reply, setReply] = useState('')
  // const FocusHandle = (e) => {
  //   setFocus(true);
  //   // setInputValue(e.target.value);
  //   // if (inputValue !== '') {
  //   //   setFocus(true);
  //   // }
  // };
  const cancelHandle = (e) => {
    e.preventDefault()
    setInputValue('')
    setFocus(false)
    setUser('')
    setReply('')
  }
  const replyHandle = (text, user) => {
    setUser(user)
    setReply(text)
    setFocus(true)
  }
  const iconHandle = (iconId) => {
    //先複製原本的狀態 然後動態搜尋 改相反
    setActive((prevState) => ({
      ...prevState,
      [iconId]: !prevState[iconId],
    }))
  }

  return (
    <>
      <div className={styles['post-card3']}>
        {/* post-img with Sw*/}
        <div className={styles['post-img']}>
          <Carousel interval={null}>
            <Carousel.Item>
              <Image
                className={styles['user-image']}
                src="/post/p2_1.webp"
                alt="User Image"
                width={600}
                height={650}
                objectFit="cover"
              />
            </Carousel.Item>
            <Carousel.Item>
              <Image
                className={styles['user-image']}
                src="/post/p1_1.webp"
                alt="User Image"
                width={600}
                height={720}
              />
            </Carousel.Item>
          </Carousel>
        </div>
        {/* post-text */}
        <div className={styles['post-text']}>
          {/* post-user */}
          <div className={styles['post-user']}>
            <Image
              className={styles['user-image']}
              src="/post/p2_1.webp"
              alt="User Image"
              width={40}
              height={40}
            />
            <div className={styles['user-name']}>Cleo</div>
          </div>
          {/* mid-content */}
          <div className={styles['post-info-wrap']}>
            <div className={styles['post-info']}>
              <div className={`${styles['info-title']} h6`}>{title}</div>
              <div>
                <span className={styles['info-content']}>{content}</span>
                <span>#NARS</span>
                <span>#聖誕派對</span>
              </div>
              <div className={styles['info-date']}>{postCreateTime}</div>
            </div>
            <hr className={styles['line']} />
            {/* reply */}
            <div className={styles['post-reply']}>
              <div className={styles['reply-amount']}>共有2條評論</div>
              <div className={styles['reply-wrap']}>
                <div className={styles['reply-big-container']}>
                  <div className={styles['reply-big']}>
                    <Image
                      className={styles['user-image']}
                      src="/post/p2_1.webp"
                      alt="User Image"
                      width={40}
                      height={40}
                    />
                    <ReplyInfo
                      onReplyClick={replyHandle}
                      username="Anna"
                      datetime="2022-12-12 12:12:12"
                      replyContent="新的遮瑕膏測評! 遮瑕力超強"
                      likeCount={15}
                      replyCount={10}
                    />
                  </div>
                  <div className={styles['reply-small-container']}>
                    <div className={styles['reply-small']}>
                      <Image
                        className={styles['user-image']}
                        src="/post/p1_1.webp"
                        alt="User Image"
                        width={34}
                        height={34}
                      />
                      <ReplyInfo
                        onReplyClick={replyHandle}
                        username="Anna"
                        datetime="2022-12-12 12:12:12"
                        replyContent="新的遮瑕膏測評! "
                        likeCount={15}
                        replyCount={10}
                      />
                    </div>
                    <div className={styles['reply-more']}>展開 3 條回覆</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* bott */}
          <form className={styles['post-comment']}>
            <div className={styles['reply-user']}>
              <span> {user}</span>
              <span>{reply}</span>
            </div>
            <div className={styles['reply-wrap']}>
              <input
                type="text"
                className={styles['reply-input']}
                placeholder="新增評論"
                onFocus={() => setFocus(true)}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {!focus ? (
                <div className={styles['comment-icons']}>
                  {icons.map((icon) => (
                    <div key={icon.id}>
                      <div onClick={(e) => iconHandle(icon.id)}>
                        {active[icon.id] ? icon.active : icon.default}
                      </div>
                      <span>{likeCount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles['btns']}>
                  <button className={` ${styles['send']}`}>發送</button>
                  <button
                    className={`${styles['cancel']}`}
                    onClick={cancelHandle}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
