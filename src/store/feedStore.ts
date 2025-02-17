import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeedState {
  likes: { [key: string]: boolean };
  comments: { [key: string]: Array<{ user: string; text: string; avatar?: string }> };
  setLike: (id: string, liked: boolean) => void;
  addComment: (id: string, comment: { user: string; text: string; avatar?: string }) => void;
  getLikeCount: (id: string, baseCount: number) => number;
  getComments: (id: string, baseComments: Array<{ user: string; text: string }>) => Array<{ user: string; text: string }>;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      likes: {},
      comments: {},
      
      setLike: (id, liked) => 
        set(state => ({
          likes: { ...state.likes, [id]: liked }
        })),
        
      addComment: (id, comment) =>
        set(state => ({
          comments: {
            ...state.comments,
            [id]: [...(state.comments[id] || []), comment]
          }
        })),
        
      getLikeCount: (id, baseCount) => {
        const isLiked = get().likes[id];
        return baseCount + (isLiked ? 1 : 0);
      },
      
      getComments: (id, baseComments) => {
        const additionalComments = get().comments[id] || [];
        return [...baseComments, ...additionalComments];
      }
    }),
    {
      name: 'feed-storage',
    }
  )
); 