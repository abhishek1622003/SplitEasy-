import { useState } from 'react';

export function useFriends() {
  const [friends, setFriends] = useState([]);

  const addFriend = (friend) => {
    const newFriend = {
      ...friend,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setFriends(prev => [...prev, newFriend]);
  };

  const deleteFriend = (id) => {
    setFriends(prev => prev.filter(friend => friend.id !== id));
  };

  return {
    friends,
    addFriend,
    deleteFriend
  };
}