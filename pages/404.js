import Link from 'next/link'

const errorStyles = {
  display:'flex',
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center',
  width:'100%',
  height:'100vh'  
}

export default function FourOhFour() {
  return (
    <div style={errorStyles}>
      <h1>404 - Page Not Found</h1>
      <Link href="/">
        <a>
          Go back home
        </a>
      </Link>
    </div>
  )
}