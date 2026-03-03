import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { AtSymbolIcon, BellIcon } from "@heroicons/react/24/outline";

export const getNotiIcon = (type) => {
  switch (type) {
    case "like_post":
    case "like_comment":
      return <HeartIcon className="w-3.5 h-3.5 text-red-500" />;
    case "comment":
      return <ChatBubbleLeftIcon className="w-3.5 h-3.5 text-blue-500" />;
    case "follow":
      return <UserPlusIcon className="w-3.5 h-3.5 text-green-500" />;
    case "mention":
      return <AtSymbolIcon className="w-3.5 h-3.5 text-orange-500" />;
    default:
      return <BellIcon className="w-3.5 h-3.5 text-gray-400" />;
  }
};

export const getNotiContent = (noti) => {
  const name = noti.actor?.full_name || "Someone";
  switch (noti.type) {
    case "like_post":
      return (
        <span>
          <span className="font-bold text-indigo-200">{name}</span> liked your post.
        </span>
      );
    case "like_comment":
      return (
        <span>
          <span className="font-bold text-indigo-200">{name}</span> liked your comment: "{noti.content}"
        </span>
      );
    case "comment":
      return (
        <span>
          <span className="font-bold text-indigo-200">{name}</span> commented: "{noti.content}"
        </span>
      );
    case "follow":
      return (
        <span>
          <span className="font-bold text-indigo-200">{name}</span> started following you.
        </span>
      );
    case "mention":
      return (
        <span>
          <span className="font-bold text-indigo-200">{name}</span> mentioned you: "{noti.content}"
        </span>
      );
    default:
      return <span>New notification.</span>;
  }
};
