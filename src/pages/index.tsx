import { GetStaticProps } from 'next'

import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { Footer } from '@/components/Footer'

//Import banco de dados
import { getPrismicClient } from '@/services/prismic'
import Prismic from '@prismicio/client'

import { RichText } from 'prismic-dom'

type Content = {
  title: string,
  titleContent: string,
  linkAction: string,
  mobileTitle: string,
  mobileContent: string,
  mobileBanner: string,
  webTitle: string,
  webContent: string,
  webBanner: string,
}

interface ContentProps{
  content: Content
}

export default function Home({content}: ContentProps) {

  console.log(content)


  return (
    <>
      <Head>
        <title>Apaixonado por tecnologia</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span>
            <a href={content.linkAction}>
              <button>Começar agora</button>
            </a>
          </section>
          <img
             src='/images/banner-conteudos.png'
             alt='Conteúdo Sujeito Programador.'
            />
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}> 
        <section >
            <h2>{content.mobileTitle}</h2>
            <span>{content.mobileContent}</span>
          </section>

          <img 
            src={content.mobileBanner}
            alt='conteudo finanças'
          />
        </div>

        <hr className={styles.divisor}/>

          <div className={styles.sectionContent}> 

            <img 
              src={content.webBanner}
              alt='Desenvolvimento de aplicações'
            />

          <section >
              <h2>{content.webTitle}</h2>
              <span>{content.webContent}</span>
            </section>

          </div>

          <Footer content={{
          linkAction: 'https://www.youtube.com/Sujeitoprogramador/'
        }} />

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async() => {

  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'home')
  ])

  //console.log(response.results[0].data)

  const {
    title, sub_title, link_action,
    mobile, mobile_banner, mobile_content,
    title_web, web_content, web_banner
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    linkAction: link_action.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    webTitle: RichText.asText(title_web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url
  }


  return{
    props:{
      content
    },
    revalidate: 60 * 2 // Gerado a cada 2 min
  }
}
