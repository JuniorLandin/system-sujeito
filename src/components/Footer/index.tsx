import styles from './styles.module.scss'
import Image from 'next/image'
import techsImage from '../../../public/images/techs.svg'


import { GetStaticProps } from 'next'
import { getPrismicClient } from '@/services/prismic'
import Prismic from '@prismicio/client'

type Content = {
  linkAction: string,
}

interface ContentProps{
  content: Content
}

export function Footer({content}: ContentProps){
    return(
        <div className={styles.Container}>
            <Image
              src={techsImage}
              alt="Technologias"
            />
            <h2>Mais de <span>15 mil</span> já levaram sua carreira ao próximo nivel</h2>
            <span>E você vai perder a chance de evoluir de uma vez por todos</span>
            <a href={content.linkAction}>
              <button>ACESSAR TURMA!</button>
            </a>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async() => {

  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at('document-type', 'home')
  ])

  const {
    link_action
  } = response.results[0].data;

  const content = {
    linkAction: link_action.url,
  }



  return{
    props: {
      content
    },
     revalidate: 60 * 2
  }

}