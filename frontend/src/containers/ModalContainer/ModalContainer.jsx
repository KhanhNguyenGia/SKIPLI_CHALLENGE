import React, { useEffect, useState } from 'react';
import { Button, Modal, Card } from '../../components';
import { ReactComponent as HeartIcon } from '../../assets/heart.svg';
import { ReactComponent as HeartIconFilled } from '../../assets/heart-filled.svg';
import style from './ModalContainer.module.css';
import { GITHUB_GET_USER, ORIGIN } from '../../constants/routes';

const ModalContainer = ({ loading, showModal, onClose, likedUsers, onLike }) => {
	const [profiles, setProfiles] = useState([]);

	useEffect(() => {
		document.body.style.overflow = showModal ? 'hidden' : 'auto';
	}, [showModal]);

	useEffect(() => {
		const fetchProfiles = async () => {
			try {
				const data = await Promise.all(
					likedUsers.map((user) =>
						fetch(`${ORIGIN}${GITHUB_GET_USER}/${encodeURI(user)}`).then((res) => res.json())
					)
				);
				setProfiles(data);
			} catch (error) {}
		};
		fetchProfiles();
	}, [likedUsers]);

	return (
		<Modal open={showModal} onClose={onClose}>
			<h2 className={style['modal-title']}>Phone: {localStorage.getItem('phoneNumber')}</h2>
			<h2 className={style['modal-title']}>Liked users:</h2>
			<div className={style.main}>
				{profiles.map(({ id, login, avatar_url, html_url, public_repos, followers }) => (
					<Card key={id}>
						<div className={style['user-info']}>
							<div>
								<img className={style['user-avatar']} src={avatar_url} alt={login} />
							</div>
							<div className={style['user-name']}>@{login}</div>
							<div className={style['user-name']}>ID: {id}</div>
						</div>
						<div>
							<a className={style['user-link']} href={html_url} target='_blank' rel='noreferrer'>
								Profile
							</a>
						</div>
						<div className={style['user-link']}>Public Repos: {public_repos}</div>
						<div className={style['user-link']}>Followers: {followers}</div>
						<Button className={style['heart']} onClick={() => onLike(id)} disabled={loading}>
							{likedUsers.includes(id) ? <HeartIconFilled /> : <HeartIcon />}
						</Button>
					</Card>
				))}
			</div>
		</Modal>
	);
};

export default ModalContainer;
