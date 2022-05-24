/* eslint-disable @next/next/no-img-element */
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { LazyLoadImage } from "react-lazy-load-image-component"
import useLocalStorage from "use-local-storage"
import { useObserver } from "../lib/hooks/useObserver"
import style from "../styles/pokemon.module.scss"

const PokemonCard = ({ id, name }) => {
	const target = useRef(null)
	const [visible, setVisible] = useState(false)

	const [scrollY, setScrollY] = useLocalStorage("poke_list_scroll", 0)

	const onIntersect = ([entry]) =>
		entry.isIntersecting ? setVisible(true) : setVisible(false)

	useObserver({
		target,
		onIntersect,
		threshold: 0.1,
	})

	return (
		<Link href={`/pokemon/${id}`} key={name}>
			<a
				className={style.pokemon_item}
				ref={target}
				onClick={() => setScrollY(window.scrollY)}
			>
				{visible && (
					<>
						<LazyLoadImage
							src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
							alt={name}
						/>
						<div className={style.item}>
							<div className={style.info_box}>
								<p className={style.label}>ID</p>
								<p className={style.info}>{id}</p>
							</div>
							<div className={style.info_box}>
								<p className={style.label}>name</p>
								<p className={style.info}>{name}</p>
							</div>
						</div>
					</>
				)}
			</a>
		</Link>
	)
}

export default PokemonCard
