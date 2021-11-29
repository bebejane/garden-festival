import styles from "./Button.module.scss"
import cn from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import anime from "animejs";

export default function Button({children, href, className}) {
  const button = <button className={cn(styles.button, className)}>{children}</button>
	return !href ? button : <Link href={href}>{button}</Link>
}