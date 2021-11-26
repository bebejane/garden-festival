import styles from "./Menu.module.scss"
import Link from "next/link"
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter()
	return (
		<div className={styles.container} >
      <h1 className={styles.header}>
        The Community Garden Festival
      </h1>
			<ul>
        <Link href={'/'}><li className={router.pathname === '/' ? styles.selected : undefined }>Garden</li></Link>
        <Link href={'/participants'}><li className={router.pathname === '/participants' ? styles.selected : undefined }>Participants</li></Link>
        <Link href={'/program'}><li className={router.pathname === '/program' ? styles.selected : undefined }>Program</li></Link>
      </ul>
		</div>
	);
}