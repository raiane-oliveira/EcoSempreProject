import { Link, useLoaderData, useNavigation, Form } from 'react-router-dom'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { HeaderSection } from '../../components/HeaderSection'
import { AsideBlog } from '../../components/AsideBlog'
import { Pagination } from '../../components/Pagination'
import api from '../../api/posts'
import './SearchResult.css'

const linksMenu = [
  {
    name: 'Início',
    path: '/',
  },
  {
    name: 'Busca',
  },
]
const POSTS_PER_PAGE = 3

export async function loader({ request }) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return { posts: [], q }
  }

  const posts = await api
    .get(`/articles?title_like=${q}`)
    .then((response) => response.data)
    .catch((err) => {
      throw new Response('', {
        status: err.response.status,
        statusText: err.response.statusText,
      })
    })

  return { posts, q }
}

export function SearchResult() {
  const { posts, q } = useLoaderData()
  const [pageIndex, setPageIndex] = useState(0)

  const startIndex = pageIndex * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const postsPerPage = posts.slice(startIndex, endIndex)

  return (
    <main className={`main_search_result`}>
      <HeaderSection
        title="Resultados da busca"
        linksMenu={linksMenu}
        className={'header'}
      />

      <div className={`container_content container`}>
        {posts.length ? (
          <div className={'posts_container'}>
            {postsPerPage.map((post) => (
              <Card
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                imgURL={post.imgURL}
              />
            ))}

            <Pagination
              postsPerPage={POSTS_PER_PAGE}
              pageIndex={pageIndex}
              onNextPage={setPageIndex}
              postsLength={posts.length}
            />
          </div>
        ) : (
          <section className={'error_wrapper'}>
            <h2 className={'title'}>Nenhum Resultado Encontrado!</h2>
            <p className={'content_error'}>
              Desculpe, não encontramos resultados para a sua busca. Mas não
              desista! Continue explorando nosso site para encontrar outras
              informações valiosas sobre reciclagem e sustentabilidade.
            </p>

            <FormSearch key={q} placeholder="Pesquisar..." />
          </section>
        )}

        <AsideBlog />
      </div>
    </main>
  )
}

function FormSearch({ placeholder }) {
  const [search, setSearch] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const navigation = useNavigation()

  return (
    <Form
      role="search"
      className={`search_form ${isTouched ? 'active' : ''}`}
      onFocus={() => setIsTouched(true)}
      onBlur={() => setIsTouched(false)}
    >
      <Icon className="search_icon" icon="fa6-solid:magnifying-glass" />
      <input
        type="text"
        name="q"
        aria-label={placeholder}
        placeholder={placeholder}
        className="search_input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={navigation.state === 'loading'}
      />
    </Form>
  )
}

function Card({ id, title, content, imgURL }) {
  return (
    <article className={'card_wrapper'}>
      <div className={'card_img_wrapper'}>
        <img src={imgURL} alt={title} />
      </div>

      <section className={'card_texts_wrapper'}>
        <h2 className={`title title_card`}>{title}</h2>
        <p className={'content'}>{content}</p>
        <Link to={`/posts/${id}`} className={`link_more ${'card_link'}`}>
          Saiba Mais
        </Link>
      </section>
    </article>
  )
}
