import Link from 'next/link'

const errorStyles = {
  display:'flex',
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center',
  width:'100%',
  height:'100vh'  
}

export default function FiveZeroZero() {
  return (
    <div style={errorStyles}>
      <h1>500 - Server-side error occurred</h1>
      <Link href="/">
        <a>
          Go back home
        </a>
      </Link>
    </div>
  )
}