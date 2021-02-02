import { useEffect, useState } from 'react'
import Head from 'next/head'
import Post from '../components/post'

const client = require('contentful').createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
})

function HomePage() {
  async function fetchEntries() {
    const entries = await client.getEntries({
      content_type: 'blogPost'
    })
    console.log('entries', entries);
    //
    if (entries.items) return entries.items
    console.log(`Error getting Entries.`)
  }

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function getPosts() {
      const allPosts = await fetchEntries()
      setPosts([...allPosts])
    }
    getPosts()
  }, [])

  return (
      <>
        <Head>
          <title>Next.js + Contentful</title>
          <link
              rel="stylesheet"
              href="https://css.zeit.sh/v1.css"
              type="text/css"
          />
        </Head>
        {posts.length > 0
            ? posts.map((p) => (
                <Post
                    alt={p.fields.description}
                    publishDate={p.fields.publishDate}
                    key={p.sys.id}
                    heroImage={p.fields.heroImage.fields.file.url}
                    title={p.fields.title}
                    url={p.fields.url}
                />
            ))
            : null}
      </>
  )
}

export default HomePage
