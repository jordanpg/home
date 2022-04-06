import { Typography, Container } from '@mui/material';
import React, { useEffect } from 'react';
import Chatty from '../../src/chatty/Chatty';
import ColorModeToolbar from '../../src/components/ColorModeToolbar';


const ChattyPage: React.FC = () => {

	useEffect(() => {
		// @ts-ignore
		window.chatty = new Chatty();
	}, []);

	return (
		<>
			<ColorModeToolbar>
                <Typography variant="h6" noWrap>
                    Chatty
                </Typography>
            </ColorModeToolbar>
			<Container>

			</Container>
		</>
	);
};

export default ChattyPage;