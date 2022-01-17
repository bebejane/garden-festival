import styles from './DropDown.module.scss';
import cn from 'classnames'
import Link from 'next/link'
import {useRef, useState, useEffect}  from 'react';
import { useRouter } from 'next/router';

const DropDown = ({options, className, inverted, setOpen, onSelect, open, label, hide}) => {
  
  const ref = useRef()
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const selected = options.filter( options => router.asPath === (`/${options.slug}`))[0]
  const handleClick = (option) => {
    if(onSelect)
      onSelect(option);
    setInternalOpen(false)
  }

  useEffect(()=>  setOpen && setOpen(internalOpen), [internalOpen])

  if(hide) return null
  
  return (
    <nav className={cn(styles.dropdown, className, inverted && styles.inverted, internalOpen && styles.open)} >
      <ul>
        <a>
          <li ref={ref} onClick={() => setInternalOpen(!internalOpen)}>
            {label ? label : selected ? selected.label : 'Menu' }
            <div className={cn(styles.arrow, internalOpen && styles.open)}>↓</div>
          </li>
        </a>
      </ul>
      <ul className={cn(styles.items, internalOpen && styles.open)}>
        {options.map((a, idx) =>
          {return a.slug !== undefined ?
            <Link key={idx} href={`/${a.slug}`}>
              <a onClick={()=> handleClick(a)}>
                <li>{a.label}</li>
              </a>
            </Link>
          :
            <a onClick={()=> handleClick(a)}>
              <li>{a.label}</li>
            </a>
          }
        )}
      </ul>
    </nav>
  )
}

export default DropDown;