import Head from "next/head"
import styles from './styles.module.scss'
import Image from "next/image"
import Link from "next/link"
import {FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight} from 'react-icons/fi'

//Imports API
import { GetStaticProps } from "next"
import { getPrismicClient } from "@/services/prismic"
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { useState } from "react"

type Posts = {
  slug: string,
  title: string,
  cover: string,
  description: string,
  updateAt: string,
}

interface PostsProps{
  posts: Posts[];
  page: string,
  totalPage: string;
}

export default function Posts({posts: postsBlog, page, totalPage}: PostsProps){

  const [posts, setPosts] = useState(postsBlog || [])
  const [currentPage, setCurrentPage] = useState(Number(page))

  //Buscar novos posts
  const reqPost = async(pageNumber: number) => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      orderings: '[document.last_publication_date desc]', // Ordernando pelo mais recente
      fetch: ['post.title', 'post.description', 'post.cover'],
      pageSize: 3,
      page: String(pageNumber)
    })
    return response
  }

  const navigatePage = async(pageNumber: number) => {
    const response = await reqPost(pageNumber)

    if(response.results.length === 0) {
      return;
    }

    const getPosts = response.results.map( post => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
        cover: post.data.cover.url,
        updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    })

    setCurrentPage(pageNumber)
    setPosts(getPosts)

  }
  

    return(
        <div>
            <Head>
                <title>Conteudo</title>
            </Head>

            <main className={styles.container}>
              <div className={styles.content}>
              {posts.map(item => (
                <Link key={item.slug} href={`/posts/${item.slug}`} legacyBehavior>
                  <a key={item.slug}>
                    <Image
                    src={item.cover}
                    alt={item.title}
                    width={720}
                    height={410}
                    quality={100}
                    />
                    <h2>{item.title}</h2>
                    <time>{item.updateAt}</time>
                    <article>{item.description}</article>

                  </a>
                </Link>
              ))}

                <div className={styles.buttons}>

                  {Number(currentPage) >= 2 && (
                    <div>
                      <button onClick={() => navigatePage(1)}>
                        <FiChevronsLeft size={25}/>
                      </button>
                      <button  onClick={() => navigatePage(Number(currentPage - 1))}>
                        <FiChevronLeft size={25} />
                      </button>
                    </div>
                  )}

                  { Number(currentPage) < Number(totalPage) && (
                  <div>
                    <button  onClick={() => navigatePage(Number(currentPage + 1))}>
                      <FiChevronRight size={25}/>
                    </button>
                    <button  onClick={() => navigatePage(Number(totalPage))}>
                      <FiChevronsRight size={25}/>
                    </button>
                  </div>
                  )}
              </div>
              </div>
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async()=> {

  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    orderings: '[document.last_publication_date desc]', // Ordernando pelo mais recente
    fetch: ['post.title', 'post.description', 'post.cover'],
    pageSize: 3
  })


  const posts = response.results.map( post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
      cover: post.data.cover.url,
      updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages
    },
    revalidate: 60 * 30 // Atualiza a cada 30 minutos
  }
}