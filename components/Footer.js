import styles from "./Footer.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Footer({ abouts, setAbout }) {
	return (
		<footer className={styles.footer}>
			<a href="https://discord.gg/yQAscdHj" target="new">Discuss</a>
		</footer>
	);
}