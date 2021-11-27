import { StructuredText } from 'react-datocms';
import Annotation from './Annotation'
import Sound  from './Sound'
import ExternalLink  from './ExternalLink'
import Image from './Image'
import ImageGallery from './ImageGallery'
import Video  from './Video'

export default function StructuredContent({content}) {
  
  return (
    <StructuredText 
      data={content} 
      renderBlock={({ record }) => {
        console.log(record.__typename)
        switch (record.__typename) {
          case 'ImageRecord':
            return <Image data={record.image.responsiveImage} />;
          case 'ImageGalleryRecord':
            return <ImageGallery {...record}/>;          
          case 'ExternalLinkRecord':
              return <ExternalLink {...record}/>;
          case 'SoundRecord':
            return <Sound {...record}/>;
          case 'VideoRecord':
            return <Video {...record.url}/>;
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
          case 'TeamMemberRecord':
            return (
              <a {...transformedMeta} href={`/team/${record.slug}`}>
                {children}
              </a>
            );
          default:
            return null;
        }
      }}
    />
	);
}

export {default as Annotation} from './Annotation'
export {default as Sound } from './Sound'
export {default as ExternalLink } from './ExternalLink'
export {default as Image } from './Image'
export {default as ImageGallery} from './ImageGallery'
export {default as Video } from './Video'
