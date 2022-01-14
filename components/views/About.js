import styles from "./About.module.scss"
import cn from "classnames";
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";

export default function About({ abouts, show }) {
  if(!show) return null
  const about = abouts ? abouts[0] : null
  return (
    <div className={cn(styles.about, about && styles.show)}>
      <ContentHeader black="true">
        <div className={styles.aboutMenu}>
          <ul className={styles.aboutMenu}>
            {abouts.map((a)=>
              <a><li>{a.title}</li></a>
            )}
          </ul>
        </div>
        <h1>{about.title}</h1>
      </ContentHeader>
      <ContentMain black="true" >
        <StructuredContent content={about.content} />
      </ContentMain>
    </div>
  )
}