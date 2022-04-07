import { MessageSharp, Send } from '@mui/icons-material';
import { FormControl, IconButton, Input, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import styles from './Chatbox.module.css';

export interface ChatboxMessage {
    name: string,
    message: string
}

export interface ChatboxProps {
    messages: ChatboxMessage[],
    showResponseBox?: boolean,
    onSubmit?: (msg: string) => boolean,
    style?: React.CSSProperties
}

const Chatbox: React.FC<ChatboxProps> = ({ messages, showResponseBox, onSubmit, style }) => {
    const [response, setResponse] = React.useState<string>('');
    const msgRef = React.useRef<HTMLDivElement>(null);

    function handleSubmit()
    {
        if(onSubmit && onSubmit(response)) setResponse('');
    }

    React.useEffect(() => {
        if(msgRef?.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }, [messages, msgRef]);

    return (
        <div className={styles.chatboxContainer} style={style}>
            <div className={styles.chatboxMessages} ref={msgRef}>
                {
                    messages.map((v,i) => (
                        <div key={`cbm${i}`} className={styles.chatboxMessage} msg-name={v.name} msg-index={i}>
                            <span className={styles.chatboxName}>{v.name}</span>: 
                            <span className="chatbox-text"> {v.message}</span>
                        </div>
                    ))
                }
            </div>
            {
                showResponseBox &&
                <div className={styles.chatboxResponse}>
                    <FormControl fullWidth>
                        <Input
                            id="chatbox-response"
                            type="text"
                            value={response}
                            onChange={e => setResponse(e.target.value)}
                            onKeyPress={e => {
                                if(e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSubmit}>
                                        <Send />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
            }
        </div>
    );
};

Chatbox.defaultProps = {
    showResponseBox: true,
    onSubmit: (msg) => true
};

export default Chatbox;