import styles from "./LinkButton.module.scss"
import cn from "classnames";
import Link from "next/link";
import anime from "animejs";

export default function LinkButton({children, href, className, weekday}) {
	return (
    <Link href={href}>
      <a className={cn(styles.button, styles[weekday], className)}>
        {children}
      </a>
    </Link>
  )
}