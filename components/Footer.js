import styles from "./Footer.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Footer({abouts}) {
	return (
		<div className={styles.footer}>
			<ul>
				{abouts && abouts.map((a) =>
					<li>{a.title}</li>
				)}
			</ul>
		</div>
	);
}