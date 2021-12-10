import { StructuredText } from 'react-datocms';
import Annotation from './Annotation'
import Sound from './Sound'
import ExternalLink from './ExternalLink'
import Image from './Image'
import ImageGallery from './ImageGallery'
import Video from './Video'

export default function StructuredContent({ content }) {

  return (
    <article>
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
      />
    </article>
  );
}