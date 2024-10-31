import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { PiChatCircle } from 'react-icons/pi'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import styles from './index.module.scss'

export default function ReplyInfo({
  onReplyClick = () => {},
  comments,
  commentAuthor,
  commentCreateTime,
  commentContent,
  commentLikeCount,
  commentReplyCount,
}) {
  const userRef = useRef()
  const replyRef = useRef()
  const [active, setActive] = useState(false)

  const handle = () => {
    setActive(!active)
  }

  const icon = {
    default: <FgThumbsUp height="24" width="24" fill="#8A8A8A" />,
    hover: <FgThumbUpFill height="24" width="24" fill="#8A8A8A" />,
  }

  const replyHandle = () => {
    let user = userRef.current.textContent
    user = '回覆 ' + user
    const text = replyRef.current.textContent
    onReplyClick(text, user) // 傳遞回父組件
  }

  return (
    <>
      <div
        className={styles['reply-wrap']}
        style={{
          marginLeft: comments?.depth ? comments.depth * 20 + 'px' : '0px',
        }}
      >
        <Image
          className={styles['user-image']}
          src={`/post/p3_1.webp`}
          alt="User Image"
          width={40}
          height={40}
        />
        <div className={styles['reply-info']}>
          <div className={styles['user-name']}>
            <span ref={userRef}>{commentAuthor}</span>
            <span>{commentCreateTime}</span>
          </div>
          <div className={styles['user-reply']} ref={replyRef}>
            {commentContent}
          </div>
          <div className={styles['post-icons']}>
            <div className={styles['like']}>
              <div onClick={handle}>{active ? icon.hover : icon.default}</div>
              <span>{commentLikeCount}</span>
            </div>
            <div className={styles['reply']} onClick={replyHandle}>
              <PiChatCircle size={24} fill="#8A8A8A" />
              <span>{commentReplyCount > 0 ? commentReplyCount : `回覆`}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 遞迴渲染子評論 */}
      {comments.children && comments.children.length > 0 && (
        <div className={styles['children-comments']}>
          {comments.children.map((childComment) => (
            <ReplyInfo
              key={childComment.comment_id}
              onReplyClick={onReplyClick}
              comments={childComment} // 子評論的完整資料
              commentAuthor={childComment.comment_author_nickname}
              commentCreateTime={childComment.created_at}
              commentContent={childComment.comment_content}
              commentLikeCount={childComment.comment_like_count}
              commentReplyCount={childComment.comment_reply_count}
            />
          ))}
        </div>
      )}
    </>
  )
}
