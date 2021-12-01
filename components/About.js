import styles from "./About.module.scss"
import cn from "classnames";
import {useRouter} from "next/router";
import StructuredContent from "/components/blocks"

export default function About({about}) {
  const router = useRouter()

	return (
    <div className={cn(styles.about, about && styles.show)}>
      {about &&
        <> 
          <h1>{about.title}</h1>
          <StructuredContent content={about.content}/>
          <div className={styles.close} onClick={router.back}>×</div>
        </>
      }
    </div>
  )
}