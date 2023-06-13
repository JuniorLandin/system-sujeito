//Importanto estilos 
import styles from './styles.module.scss'

//Import Api
import { getPrismicClient } from '@/services/prismic';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Head from 'next/head';

//React Icons
import {FaYoutube,  FaInstagram, FaLinkedin} from 'react-icons/fa'



type Content = {
  title: string;
  description: string;
  image: string;
}

interface ContentProps{
  content: Content
}


const Sobre = ({content}: ContentProps) => {


  return (
    <div className={styles.div}>
      <Head>
        <title>Quem somos?</title>
      </Head>
      
      <main className={styles.content}>
        <div className={styles.containerHeader}>
          <section className={styles.section}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </section>

          <img
            src={content.image}
            alt='Imagem sobre quem somos'
          />
        </div>

        <div className={styles.link}>
          <a href='https://www.instagram.com/junior_landin/?next=%2F'>
            <FaInstagram />
          </a>
          <a href='https://www.linkedin.com/in/euripedes-landin-244027228/'>
            <FaLinkedin/>
          </a>
          <a href='https://www.youtube.com'>
            <FaYoutube />
          </a>
        </div>

      </main>
    </div>

  )
}

export default Sobre;

export const getStaticProps: GetStaticProps = async() => {

  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'sobre')
  ])

  const  {
    title, description, image
  } = response.results[0].data

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    image: image.url
  }

  return{
    props:{
      content
    }
  }
}
