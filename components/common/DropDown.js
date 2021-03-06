import styles from './DropDown.module.scss';
import cn from 'classnames'
import Link from 'next/link'
import {useRef, useState, useEffect}  from 'react';
import { useRouter } from 'next/router';
import { useOutsideClick } from 'rooks';

const DropDown = ({options, className, inverted, setOpen, onSelect, label, hide}) => {
  
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  let selected = options.filter( option => router.asPath === `/${option.slug}`)[0]
  if(!selected)
    selected = options.filter( option => option.slug && router.asPath.startsWith(`/${option.slug.split('/')[0]}`))[0]

  const handleClose = () => setInternalOpen(false);
  const handleClick = (option) => {
    if(onSelect && option) onSelect(option);
    handleClose()
  }
  useEffect(()=>  setOpen && setOpen(internalOpen), [internalOpen])
  useEffect(()=> {
    router.events.on('beforeHistoryChange', handleClose);
    return () => router.events.off('beforeHistoryChange', handleClose);
  }, [])

  if(hide) return null
  
  return (
    <nav className={cn(styles.dropdown, className, inverted && styles.inverted, internalOpen && styles.open)} >
      <ul>
        <a>
          <li onClick={() => setInternalOpen(!internalOpen)}>
            {label ? label : selected ? selected.label : 'Menu'}
            <div className={cn(styles.arrow, internalOpen && styles.open)}>↓</div>
          </li>
        </a>
      </ul>
      <ul className={cn(styles.items, internalOpen && styles.open)}>
        {options.map((a, idx) =>
          {return a.slug !== undefined ?
            <Link prefetch={false} key={idx} href={`/${a.slug}`}>
              <a onClick={()=> handleClick(a)}>
                <li>{a.label}</li>
              </a>
            </Link>
          :
            <a key={idx} onClick={()=> handleClick(a)}>
              <li>{a.label}</li>
            </a>
          }
        )}
      </ul>
    </nav>
  )
}

export default DropDown;