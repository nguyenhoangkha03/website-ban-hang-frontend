'use client';

interface VideoPlayerProps {
    videoUrl: string;
    thumbnail?: string;
    title: string;
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export default function VideoPlayer({ videoUrl, thumbnail, title }: VideoPlayerProps) {
    const youtubeId = extractYouTubeId(videoUrl);

    if (youtubeId) {
        // YouTube embed
        return (
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        );
    }

    // HTML5 video player (for uploaded videos)
    return (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <video
                src={videoUrl}
                poster={thumbnail}
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
