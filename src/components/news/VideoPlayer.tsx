'use client';

interface VideoPlayerProps {
    videoFile?: string;
    thumbnail?: string;
    title: string;
}

export default function VideoPlayer({ videoFile, thumbnail, title }: VideoPlayerProps) {
    if (!videoFile) return null;

    // Static files are served from root /uploads/, not /api/uploads/
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const videoUrl = `${BASE_URL}/uploads/${videoFile}`;
    const thumbnailUrl = thumbnail ? `${BASE_URL}/uploads/${thumbnail}` : undefined;

    // HTML5 video player for uploaded videos
    return (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <video
                src={videoUrl}
                poster={thumbnailUrl}
                controls
                preload="metadata"
                className="w-full h-full"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
