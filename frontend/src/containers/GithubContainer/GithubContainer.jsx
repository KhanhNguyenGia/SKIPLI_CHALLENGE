import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ReactComponent as UserIcon } from '../../assets/user.svg';
import { ReactComponent as HeartIcon } from '../../assets/heart.svg';
import { ReactComponent as HeartIconFilled } from '../../assets/heart-filled.svg';
import SearchContainer from '../SearchContainer/SearchContainer';
import ModalContainer from '../ModalContainer/ModalContainer';
import { Button, Card, Pagination } from '../../components';
import style from './GithubContainer.module.css';
import { GITHUB_GET_PROFILE, GITHUB_SEARCH, ORIGIN } from '../../constants/routes';

const getURLParams = (url) => {
	const urlParams = new URLSearchParams(url);
	const q = urlParams.get('q')?.replace(' in:login', '');
	const perPage = urlParams.get('per_page');
	const page = urlParams.get('page');
	return { q, perPage, page };
};

const GithubContainer = () => {
	const navigate = useNavigate();
	const { q, perPage, page } = getURLParams(window.location.search);
	const searchRef = useRef(q || '');
	const perPageRef = useRef(+perPage || 40);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(+page || 1);
	const [maxPage, setMaxPage] = useState(1);
	const [users, setUsers] = useState([]);
	const [likedUsers, setLikedUsers] = useState(
		JSON.parse(localStorage.getItem('likedProfile')) || []
	);
	const [showModal, setShowModal] = useState(false);

	const onClose = () => setShowModal(false);

	const onToggleModal = () => setShowModal((prev) => !prev);

	const onSearchChange = (e) => {
		searchRef.current = e.target.value;
	};

	const onPerPageChange = (e) => {
		perPageRef.current = Math.max(30, Math.min(100, e.target.value));
	};

	const fetchNewPage = async (nextPage) => {
		if (!searchRef.current || perPageRef.current < 40 || perPageRef > 100 || loading) return;
		setLoading(true);
		try {
			const result = await fetch(
				`${ORIGIN}${GITHUB_SEARCH}?q=${encodeURIComponent(
					searchRef.current + ' in:login'
				)}&per_page=${perPageRef.current}&page=${nextPage}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
				}
			);
			if (!result.ok) throw new Error('Invalid request');
			const { users, pages } = await result.json();
			setUsers(users);
			setMaxPage(pages);
		} catch (error) {
			navigate('/github');
		} finally {
			setLoading(false);
		}
	};

	const onNavigate = (page) => {
		const newPage = Math.max(1, Math.min(maxPage, page));
		fetchNewPage(newPage);
		navigate(
			`/github?q=${encodeURIComponent(searchRef.current + ' in:login')}&per_page=${
				perPageRef.current
			}&page=${newPage}`
		);
		setCurrentPage(newPage);
	};

	const onSearch = async (e) => {
		e.preventDefault();
		onNavigate(1);
	};

	const onLike = async (id) => {
		let newList;
		setLoading(true);
		try {
			const result = await fetch(`http://localhost:4000/github/like`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					github_user_id: id,
					phone_number: localStorage.getItem('phoneNumber'),
				}),
			});
			if (!result.ok) throw new Error('Invalid request');
			if (likedUsers.includes(id)) {
				newList = likedUsers.filter((user) => user !== id);
			} else {
				newList = [...likedUsers, id];
			}
			localStorage.setItem('likedProfile', JSON.stringify(newList));
			setLikedUsers(newList);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Fetch the requested page in params if params are valid
		// Guarantee refetching on reload
		if (q && perPage && page) {
			fetchNewPage(page);
		}

		const getLikedUsers = async () => {
			setLoading(true);
			try {
				const result = await fetch(
					`${ORIGIN}${GITHUB_GET_PROFILE}/${encodeURIComponent(
						localStorage.getItem('phoneNumber')
					)}`,
					{
						method: 'GET',
						headers: {
							Accept: 'application/json',
						},
					}
				);
				if (!result.ok) throw new Error('Invalid request');
				const { favorite_github_users } = await result.json();
				localStorage.setItem('likedProfile', JSON.stringify(favorite_github_users));
				setLikedUsers(favorite_github_users);
			} catch (error) {
			} finally {
				setLoading(false);
			}
		};

		if (likedUsers.length === 0) {
			getLikedUsers();
		}
		// All dependencies are only used once for prefetching data.
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className={style.wrapper}>
				<nav className={style.nav}>
					<SearchContainer
						searchRef={searchRef}
						onSearchChange={onSearchChange}
						onPerPageChange={onPerPageChange}
						loading={loading}
						onSearch={onSearch}
						perPageRef={perPageRef}
					/>
					<Button onClick={onToggleModal} className={style['profile']}>
						<UserIcon />
					</Button>
				</nav>
				<main className={style.main}>
					{users.length === 0 ? (
						<h2>Result is empty, change your search params and retry</h2>
					) : (
						<>
							<h2 style={{ width: '100%', textAlign: 'center' }}>
								Showing results for "{searchRef.current}" in login
							</h2>
							<Pagination
								maxPage={maxPage}
								currentPage={currentPage}
								onNavigate={onNavigate}
								loading={loading}
							/>
							{users.map(({ id, login, avatar_url, html_url, public_repos, followers }) => (
								<Card key={id}>
									<div className={style['user-info']}>
										<div>
											<img className={style['user-avatar']} src={avatar_url} alt={login} />
										</div>
										<div className={style['user-name']}>@{login}</div>
										<div className={style['user-name']}>ID: {id}</div>
									</div>
									<div>
										<a
											className={style['user-link']}
											href={html_url}
											target='_blank'
											rel='noreferrer'
										>
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
							<Pagination
								maxPage={maxPage}
								currentPage={currentPage}
								onNavigate={onNavigate}
								loading={loading}
							/>
						</>
					)}
				</main>
			</div>
			<ModalContainer
				likedUsers={likedUsers}
				showModal={showModal}
				onClose={onClose}
				onLike={onLike}
			/>
		</>
	);
};

export default GithubContainer;
