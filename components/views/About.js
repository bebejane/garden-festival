
import styles from "./About.module.scss"
import cn from "classnames";
import Link from 'next/link'
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import { useRouter } from "next/router";
import DropDown from "/components/common/DropDown";

export default function About({ about, abouts, show }) {

  if (!show) return null

  const { asPath: pathname } = useRouter()

  return (
    <div className={cn(styles.about, about && styles.show)}>
      <ContentHeader black={true}>
        <DropDown
          className={styles.aboutMobileDropDown}
          options={abouts.map(a => { return { label: a.menuTitle, slug: `about/${a.slug}` } })}
          inverted={true}
        />
        <div className={styles.aboutMenu}>
          <ul className={styles.aboutMenu}>
            {abouts.map((a, idx) =>
              <Link key={idx} href={`/about/${a.slug}`}>
                <a>
                  <li className={pathname === `/about/${a.slug}` && styles.selected}>{a.menuTitle}</li>
                </a>
              </Link>
            )}
          </ul>
        </div>
        <h1>{about?.title}</h1>
      </ContentHeader>
      <ContentMain black={true} >
        {about && <StructuredContent content={about.content} />}
      </ContentMain>
    </div>
  )
}