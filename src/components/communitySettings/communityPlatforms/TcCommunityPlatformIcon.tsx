import { FaDiscord } from "react-icons/fa";
import { FaTelegram, FaTwitter } from "react-icons/fa6";
import { FaDiscourse } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import React from "react";

interface TcCommunityPlatformIconProps {
    platform: string;
}

function TcCommunityPlatformIcon({ platform }: TcCommunityPlatformIconProps) {
    const renderIcon = () => {
        switch (platform) {
            case 'Discord':
                return <FaDiscord size={44} />;
            case 'Twitter':
                return <FaTwitter size={44} />;
            case 'Discourse':
                return <FaDiscourse size={44} />
            case 'Telegram':
                return <FaTelegram size={44} />
            case 'Snapshot':
                return <AiFillThunderbolt size={44} />
            case 'Github':
                return <FaGithub size={44} />
            case 'GDrive':
                return <FaGoogleDrive size={44} />
            default:
                return null;
        }
    };

    return (
        <div>
            {renderIcon()}
        </div>
    );
}

export default TcCommunityPlatformIcon;
