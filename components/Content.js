import styles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";

export default function Content({show, children, setShow, setView}) {

	return (
		<div className={cn(styles.contentWrap, show && styles.show)}>
      <div className={styles.content}>
				{children}
				<div 
					className={styles.close} 
					onClick={()=>setView('garden')}
				>×</div>
			</div>
			<div className={styles.footer}>
				Footer
			</div>				
		</div>
	);
}