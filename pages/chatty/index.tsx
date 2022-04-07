import { Timeline } from '@mui/icons-material';
import { Typography, Container, Box, Tooltip, IconButton, Modal, Card, CardContent, NoSsr } from '@mui/material';
import { styled } from '@mui/styles';
import React, { useEffect } from 'react';
// import { ForceGraph3D } from 'react-force-graph';
import SpriteText from 'three-spritetext';
import Chatty from '../../src/chatty/Chatty';
import Chatbox, { ChatboxMessage } from '../../src/chatty/components/Chatbox';
import ColorModeToolbar from '../../src/components/ColorModeToolbar';
import dynamic from 'next/dynamic';

const ChattyChatbox = styled(Chatbox)(({theme}) => ({

}));

// i dont wana rebuild all the types for this dumb library so i will pray to the demons and unholy christ that it Just Works
// this component causes errors when even just importing it with SSR so i gotta dynamically import it client only ahhhhhhhhh
const ForceGraph3D = dynamic(
	// @ts-ignore
	() => import('react-force-graph').then(m => m.ForceGraph3D),
	{ ssr: false }
)


const ChattyPage: React.FC = () => {
	const [messages, setMessages] = React.useState<ChatboxMessage[]>([
		{ message: "Type messages to begin training and talking with the chatbot!", name: "System" }
	]);
	const [open, setOpen] = React.useState(false);
	const [dragModal, setDragModal] = React.useState(false);

	const bot = React.useMemo(() => new Chatty(), [Chatty]);
	const graphData = React.useMemo(() => bot.createGraphData(), [Chatty, messages]);

	const [ch, setCh] = React.useState(800);
	const [cw, setCw] = React.useState(1000);
	const [cd, setCd] = React.useState<HTMLDivElement | null>(null);

	useEffect(() => {
		const ro = new ResizeObserver(e => {
			console.log(e);
			setCw(e[0].contentBoxSize[0].inlineSize);
			setCh(e[0].contentBoxSize[0].blockSize);
		});

		console.log(cd);

		if(cd)
			ro.observe(cd);
	}, [cd]);

	return (
		<Container sx={{ height:'100vh', maxHeight: '100vh', padding: '0px!important', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} maxWidth={false}>
			<ColorModeToolbar>
				<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
					Chatty
				</Typography>
				<Tooltip title="Toggle Graph">
					<IconButton
						size="large"
						edge="end"
						onClick={() => setOpen(v => !v)}
					>
						<Timeline />
					</IconButton>
				</Tooltip>	
			</ColorModeToolbar>
			{/* <style global jsx>{`
				.chatbox-message[msg-name="User A"] {
					background-color: white;
				}
			`}</style> */}
			<Box sx={{ padding: '24px', display: 'flex', flex: '1', overflow: 'auto' }}>
				<div style={{ display: 'flex', flex: '1' }}
					onDrop={e => {
						// console.log(e);

						e.stopPropagation();
						e.preventDefault();

						let file: File;
						if(e.dataTransfer.items) {
							// console.log(e.dataTransfer.items[0]);
							if(e.dataTransfer.items[0].kind !== 'file') {
								e.dataTransfer.items[0].getAsString(s => bot.massDigest(s));
								setMessages([...messages, {
									name: "System",
									message: "String processed successfully"
								}]);
								return false;
							}
							file = e.dataTransfer.items[0].getAsFile()!; // If the kind is file, then this should not be null
						} else {
							file = e.dataTransfer.files[0];
						}

						const reader = new FileReader();
						reader.onload = e => {
							console.log(e.target);
							if(e.target?.result){
								bot.massDigest(e.target?.result as string);
								setMessages([...messages, {
									name: "System",
									message: "File uploaded successfully"
								}]);
							}
						};
						// console.log(file);
						reader.readAsText(file);

						return false;
					}}
					onDragOver={e => {
						e.stopPropagation();
						e.preventDefault();
					}}
					onDragEnter={e => {
						e.stopPropagation();
						e.preventDefault();

						setDragModal(true);
					}}
					onDragEnd={e => {
						e.stopPropagation();
						e.preventDefault();

						setDragModal(false);
					}}
				>
					<ChattyChatbox messages={messages} onSubmit={msg => {
						bot.digest(msg);

						setMessages([...messages,
							{
								name: 'User',
								message: msg
							},
							{
								name: 'Chatty',
								message: bot.generate()
							}
						]);

						return true;
					}} />
				</div>
				

				<Modal
					open={open}
					onClose={() => setOpen(false)}
				>
					<Card variant="outlined" sx={{ position: 'absolute', top: "50%", left: '50%', transform: 'translate(-50%,-50%)', height: '80vh', width: '80vw' }}>
						<CardContent sx={{ maxHeight: '100%', display: 'flexbox', height: '100%' }}>
							<div ref={el => { setCd(el); }} style={{ maxHeight: '100%', height: '100%' }}>
								<NoSsr>
									<ForceGraph3D
										width={cw}
										height={ch}
										graphData={graphData}
										nodeAutoColorBy="group"
										nodeThreeObject={(node: any) => {
											const sprite = new SpriteText(node.id);
											sprite.color = node.color;
											sprite.textHeight = 8;
											return sprite;
										}}
										linkDirectionalArrowLength={5}
									/>	
								</NoSsr>
							</div>
							
						</CardContent>
					</Card>
				</Modal>
			</Box>
		</Container>
	);
};

export default ChattyPage;