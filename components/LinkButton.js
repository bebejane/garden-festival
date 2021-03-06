import styles from "./LinkButton.module.scss"
import cn from "classnames";
import Link from "next/link";
import anime from "animejs";

export default function LinkButton({children, href, className, weekday}) {
	return (
    <Link prefetch={false} href={href}>
      <a className={cn(styles.button, weekday && styles[weekday.toLowerCase()], className)}>
        {children}
      </a>
    </Link>
  )
}