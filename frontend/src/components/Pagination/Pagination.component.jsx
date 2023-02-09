import React from 'react';
import Button from '../Button/Button.component';
import style from './Pagination.module.css';

const Pagination = ({ loading, currentPage, onNavigate, maxPage }) => {
	return (
		<div className={style.pagination}>
			<Button disabled={loading || currentPage === 1} onClick={() => onNavigate(1)}>
				&lt;&lt;
			</Button>
			<Button disabled={loading || currentPage === 1} onClick={() => onNavigate(currentPage - 1)}>
				&lt;
			</Button>
			{[...Array(3)]
				.map(
					(_, i) =>
						currentPage - i > 1 && (
							<Button
								disabled={loading}
								key={`btn-${currentPage - i - 1}`}
								onClick={() => onNavigate(currentPage - i - 1)}
							>
								{currentPage - i - 1}
							</Button>
						)
				)
				.reverse()}
			<Button style={{ background: 'red' }}>{currentPage}</Button>
			{[...Array(3)].map(
				(_, i) =>
					currentPage + i < maxPage && (
						<Button
							disabled={loading}
							key={`btn-${currentPage + i + 1}`}
							onClick={() => onNavigate(currentPage + i + 1)}
						>
							{currentPage + i + 1}
						</Button>
					)
			)}
			<Button
				disabled={loading || currentPage === maxPage}
				onClick={() => onNavigate(currentPage + 1)}
			>
				&gt;
			</Button>
			<Button disabled={loading || currentPage === maxPage} onClick={() => onNavigate(maxPage)}>
				&gt;&gt;
			</Button>
		</div>
	);
};

export default Pagination;
