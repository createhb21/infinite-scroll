/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import axios from "axios"
import style from "../../styles/pokemon.module.scss"

const Pokemon = ({ data }) => {
	const { name, types, id, base_experience, abilities, order } = data

	return (
		<div className={style.pokemon_wrap}>
			<div className={style.sprite}>
				<img
					src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
					alt={name}
				/>
				<h1>{name}</h1>
			</div>

			<div className={style.info_wrap}>
				<div className={style.info_box}>
					<p className={style.label}>ID</p>
					<p className={style.info}>{id}</p>
				</div>

				<div className={style.info_box}>
					<p className={style.label}>도감순서</p>
					<p className={style.info}>No. {order}</p>
				</div>

				<div className={style.info_box}>
					<p className={style.label}>기본 경험치</p>
					<p className={style.info}>{base_experience} exp</p>
				</div>
				<div className={style.info_box}>
					<p className={style.label}>타입</p>
					{types.map(item => (
						<span className={style.info} key={item.slot}>
							{item.type.name}
						</span>
					))}
				</div>

				<div className={style.info_box}>
					<p className={style.label}>기술</p>
					{abilities.map((item, index) => (
						<span className={style.info} key={item.slot}>
							{item.ability.name}
							{abilities.length !== index + 1 ? ", " : ""}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = async ({ params }) => {
	const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${params.pokeId}`)

	return { props: { data } }
}

export default Pokemon
