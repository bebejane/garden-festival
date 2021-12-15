import styles from "./About.module.scss"
import cn from "classnames";
import { useRouter } from "next/router";
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";

export default function About({ about, abouts }) {
  const router = useRouter()

  return (
    <div className={cn(styles.about, about && styles.show)}>
      {about &&
        <>
          <ContentHeader black="true">
            <h1>{about.title}</h1>
          </ContentHeader>
          <ContentMain black="true" >
            <StructuredContent content={about.content} />
            <div className={styles.close} onClick={router.back}>×</div>
          </ContentMain>
        </>
      }
    </div>
  )
}