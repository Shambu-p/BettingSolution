import {createContext} from 'react';

export default createContext<{
    sendMessage: (message: any) => void,
    setReceiver: (receiverId: string, receiver: (message: any) => Promise<void>) => void,
    removeReceiver: (receiverId: string) => void
}>({
    sendMessage: null,
    setReceiver: null,
    removeReceiver: null
});