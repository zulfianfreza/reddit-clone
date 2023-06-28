import { INFINITE_SCROLLING_PAGINATION_RESULSTS } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './PostFeed'
import { getAuthSession } from '@/lib/auth'

const GeneralFeed = async () => {
  const session = await getAuthSession()

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  })

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((subreddit) => subreddit.subredditId),
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULSTS,
  })

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
