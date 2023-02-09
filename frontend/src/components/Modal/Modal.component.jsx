import React from 'react';
import style from './Modal.module.css';

const Modal = ({ children, onClose, open }) => {
	return open ? (
		<div className={style.wrapper} onClick={onClose}>
			<div className={style.modal} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	) : null;
};

export default Modal;
