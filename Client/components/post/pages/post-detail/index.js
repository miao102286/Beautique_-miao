import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import PostCard from '@/components/post/common/post-card'
import WallCard from '@/components/post/common/wall-card'
import Header from '@/components/home/common/header'
import styles from './index.module.scss'
import Link from 'next/link'

export default function Explore(props) {
  const [postCard, setPostCard] = useState([])

  const router = useRouter()
  const { postId } = router.query
  useEffect(() => {
    async function getPublishCard() {
      if (postId) {
        try {
          let response = await axios.get(
            `http://localhost:3005/api/post/post_wall/${postId}`,
            {
              withCredentials: true,
            }
          )
          setPostCard(response.data)
        } catch (error) {
          console.error('Error fetching publish card data:', error)
        }
      }
    }
    console.log(postId)
    setPostCard()
  }, [postId])
  return (
    <>
      <Header />
      <div className={styles['post-container']}>
        <div className={styles['post-read']}>
          <Link href="/post">
            <GoArrowLeft size={30} />
          </Link>

          <PostCard />
        </div>
        <div className={`h5 ${styles['post-explore']}`}>探索更多</div>
        <div className={styles['post-wall']}>
          <WallCard
            imageSrc="/post/p2_1.webp"
            title="新的遮瑕膏測評! 遮瑕力超強"
            username="Anna"
            avatarSrc="/post/user-img.png"
            likeCount={15}
          />
          <WallCard
            imageSrc="/post/p2_1.webp"
            title="新的遮瑕膏測評! 遮瑕力超強"
            username="Anna"
            avatarSrc="/post/user-img.png"
            likeCount={15}
          />
        </div>
      </div>
    </>
  )
}
