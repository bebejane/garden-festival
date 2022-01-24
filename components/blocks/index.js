import styles from "./index.module.scss"
import { StructuredText, renderNodeRule, renderMarkRule } from 'react-datocms';
import { isParagraph, isRoot } from 'datocms-structured-text-utils';
import Sound from './Sound'
import ExternalLink from './ExternalLink'
import Image from './Image'
import ImageGallery from './ImageGallery'
import Video from './Video'
import LinkButton from "/components/LinkButton";

const sanitizeText = (text) => {
  return text?.replace(/\ /g, ' ')
}

export default function StructuredContent({ content }) {
  
  if (!content) return null //Empty content

  return (
    <article className={styles.mainContent}>
      <StructuredText
        data={content}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ImageRecord':
              return <Image data={record.image} />;
            case 'ImageGalleryRecord':
              return <ImageGallery {...record} />;
            case 'ExternalLinkRecord':
              return <ExternalLink {...record} />;
            case 'SoundRecord':
              return <Sound {...record} />;
            case 'VideoRecord':
              return <Video {...record.url} />;
            default:
              return null;
          }
        }}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case 'ParticipantRecord':
              return <LinkButton href={`/${record.slug}`}>{record.title}</LinkButton>
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ record, children, transformedMeta }) => {
          switch (record.__typename) {
            default:
              return null;
          }
        }}
        renderText={sanitizeText}
        /*
        customNodeRules={[
          renderNodeRule(isParagraph,
            ({ adapter: { renderNode }, node, children, key, ancestors }) => {
              if (isRoot(ancestors[0])) {
                console.log(children)
                // If this paragraph node is a top-level one, give it a special class
                return renderNode(
                  'p',
                  { key, className: 'top-level-paragraph-container-example' },
                  children,
                );
              } else {
                // Proceed with default paragraph rendering...
                // return renderNode('p', { key }, children);
      
                // Or even completely remove the paragraph and directly render the inner children:
                return children;
              }
            },
          ),
        ]}
        */
      />
    </article>
  );
}