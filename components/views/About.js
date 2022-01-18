import styles from "./About.module.scss"
import cn from "classnames";
import Link from 'next/link'
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import {useRouter} from "next/router";
import { useState, useRef } from "react";
import DropDown from "/components/common/DropDown";

export default function About({ about, abouts, show }) {
  if (!show) return null

  const { asPath: pathname } = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <div className={cn(styles.about, about && styles.show)}>
      <ContentHeader black={true}>
        <DropDown 
          className={styles.aboutMobileDropDown} 
          options={abouts.map(a => { return {label:a.menuTitle, slug: `about/${a.slug}`}})}
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

const MobileAboutMenu = ({abouts}) => {
  
  const ref = useRef()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const selected = abouts.filter( a => router.asPath === `/about/${a.slug}`)[0]

  return (
    <nav className={cn(styles.mobileMenu, open && styles.open)} >
      <ul>
        <a>
          <li ref={ref} onClick={() => setOpen(!open)}>
            {selected ? selected.menuTitle : 'Menu' }
            <div className={cn(styles.arrow, open && styles.open)}>↓</div>
          </li>
        </a>
      </ul>
      <ul className={cn(styles.items, open && styles.open)}>
        {abouts.map((a, idx) =>
          <Link key={idx} href={`/about/${a.slug}`}>
            <a onClick={()=>setOpen(false)}>
              <li>{a.menuTitle}</li>
            </a>
          </Link>
        )}
      </ul>
    </nav>
  )
}