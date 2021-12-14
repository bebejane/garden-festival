import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'
import Link from "next/link";

const Markdown = ({ children }) => {
  if(!children) return null
  console.log(children)
  return (
    <ReactMarkdown 
      remarkPlugins={[gfm]} 
      children={children}
      components={{
        a: ({ node, ...props }) => 
        <Link 
          href={props.href} 
          scroll={false}
        >
          <a>{props.children[0]}</a>
        </Link>
      }}
    />
  )
}

export default Markdown;

