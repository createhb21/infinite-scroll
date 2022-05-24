import { useInfiniteQuery } from "react-query"
import axios from "axios"
import { useObserver } from "../lib/hooks/useObserver"
import { useRef } from "react"
import style from "../styles/index.module.scss"
import PokemonCard from "../components/PokeCard"
import useLocalStorage from "use-local-storage"
import { useEffect } from "react"

const OFFSET = 30 // 나중에 편하게 바꿀 수 있도록 page offset을 상수로 설정

// pageParam은 useInfiniteQuery의 getNextPageParam에서 자동으로 넘어온다.
// 1페이지는 undefined로 아무것도 넘어오지 않는다. 초기값을 반드시 설정해 주자.
const getPokemonList = ({ pageParam = OFFSET }) =>
	axios
		.get("https://pokeapi.co/api/v2/pokemon", {
			// axios.get(url, config),
			// url전체를 템플릿 리터럴로 넘기든 config의 params로 넘기든 취향에 맞게 넘기자.
			params: {
				limit: OFFSET,
				offset: pageParam,
			},
		})
		.then(res => res?.data)

const Index = () => {
	// 바닥 ref를 위한 useRef 선언
	const bottom = useRef(null)
	const [scrollY] = useLocalStorage("poke_list_scroll", 0)

	useEffect(() => {
		// 기본값이 "0"이기 때문에 스크롤 값이 저장됐을 때에만 window를 스크롤시킨다.
		if (scrollY !== "0") window.scrollTo(0, Number(scrollY))
	}, [])

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery("pokemonList", getPokemonList, {
		getNextPageParam: lastPage => {
			const { next } = lastPage

			if (!next) return false

			return Number(new URL(next).searchParams.get("offset"))
		},
	})

	// useObserver로 넘겨줄 callback, entry로 넘어오는 HTMLElement가
	// isIntersecting이라면 무한 스크롤을 위한 fetchNextPage가 실행될 것이다.
	const onIntersect = ([entry]) =>
		entry.isIntersecting && fetchNextPage() && console.log(entry)

	// useObserver로 bottom ref와 onIntersect를 넘겨 주자.
	useObserver({
		target: bottom,
		onIntersect,
	})

	return (
		<div className={style.pokemons_wrap}>
			{status === "loading" && <p>불러오는 중</p>}

			{status === "error" && <p>{error.message}</p>}

			{status === "success" && (
				<div className={style.pokemon_list_box}>
					{data.pages.map((group, index) => (
						<div className={style.pokemon_list} key={index}>
							{group.results.map(pokemon => {
								const { name, url } = pokemon
								const id = url.split("/")[6]

								return <PokemonCard key={name} id={id} name={name} />
							})}
						</div>
					))}
				</div>
			)}

			<div ref={bottom} />

			{isFetchingNextPage && <p>계속 불러오는 중</p>}
		</div>
	)
}

export default Index
