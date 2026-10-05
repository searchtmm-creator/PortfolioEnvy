import type { PortfolioProject } from '../data/portfolio';
import { GalleryMedia, RemoteVideo } from './ProjectMedia';

// New cases retain their source sequence without duplicating the legacy layouts.
export function ProjectStory({ project, isGlitching }: { project: PortfolioProject; isGlitching: boolean }) {
  const border = isGlitching ? 'border-black divide-black' : 'border-zinc-800 divide-zinc-800';
  const visualAlt = `${project.category.split(' // ')[0]} — ${project.title}`;

  return <div className={`flex flex-col divide-y ${border}`}>
    {project.media?.map((block, index) => {
      if (block.type === 'image') return <GalleryMedia key={index} src={block.src}
        alt={`${visualAlt} campaign visual ${index + 1}`} className="w-full h-auto" />;

      if (block.type === 'video') return <div key={index} className="aspect-video w-full relative overflow-hidden">
        <RemoteVideo src={block.src} poster={block.poster} title={project.title}
          className="absolute inset-0 w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>;

      if (block.type === 'gallery') return <div key={index}
        className={`grid grid-cols-1 sm:grid-cols-2 border-inherit ${border}`}>
        {block.images.map((src, imageIndex) => <GalleryMedia key={src} src={src}
          alt={`${visualAlt} photograph ${index + 1}.${imageIndex + 1}`}
          className={`w-full h-auto self-center ${block.images.length % 2 === 1 && imageIndex === block.images.length - 1 ? 'sm:col-span-2' : ''}`} />)}
      </div>;

      return <a key={index} href={block.href} target="_blank" rel="noopener noreferrer"
        className="p-5 font-mono text-xs text-brand-orange underline underline-offset-4 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-[-4px]">
        {block.label} ↗
      </a>;
    })}
  </div>;
}
