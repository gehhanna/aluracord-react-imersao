import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';



// como fazer Ajax. https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzYzNzg4NCwiZXhwIjoxOTU5MjEzODg0fQ.7CmhKi84ZtgTkmbn3sgLfGHBP7oLc_U5PS7c7XHhc9k';
const SUPABASE_URL = 'https://dpcrpoelqbnwbjqexzam.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
	return supabaseClient
		.from('mensagens')
		.on('INSERT', (respostaLive) => {
			adicionaMensagem(respostaLive.new);
		})
		.subscribe();
}
export default function ChatPage() {
	const roteamento = useRouter();
	const usuarioLogado = roteamento.query.username;
	console.log(roteamento.query);
	console.log('usuarioLogado', usuarioLogado);
	const [mensagem, setMensagem] = React.useState('');
	const [listaDeMensagens, setListaDeMensagens] = React.useState([

	]);



	// Sua lógica vai aqui
	// Usuário
	// - usuário digita no campo 'textarea'
	// - aperta enter para enviar
	// - tem que adicionar o texto na listagem

	// Dev
	// [x] Campo Criado
	// [ ] Vamos usar o onChange usa o useState (ter if pra caso seja enter para limpar a variável)
	// [ ] Lista de mensagens
	// ./Sua lógica vai aqui


	React.useEffect(() => {

		supabaseClient
			.from('mensagens')
			.select('*')
			.order('id', { ascending: false })
			.then(({ data }) => {
				// console.log('Dados da consulta;', data);
				setListaDeMensagens(data);
			});


		escutaMensagensEmTempoReal((novaMensagem) => {
			console.log('Nova mensagem', novaMensagem);
			console.log('listaDeMensagens:', listaDeMensagens);
			// Quero reusar um valor de referencia (objeto/array)
			// Passar uma função pro seState

			// setListaMensagens([
			// novaMensagem,
			// ...listaDeMensagens
			// ])

			setListaDeMensagens((valorAtualDaLista) => {

				return [
					novaMensagem,
					...valorAtualDaLista,
				]


			});
		});

	}, []);


	function handleNovaMensagem(novaMensagem) {
		const mensagem = {
			// id: listaDeMensagens.length + 1,
			de: usuarioLogado,
			texto: novaMensagem
		};
		supabaseClient
			.from('mensagens')
			.insert([
				// Tem que ser o objeto com os MESMOS CAMPOS que você escreveu no supabase.
				mensagem
			])
			.then(({ data }) => {
				console.log('Criando mensagem: ', data);
				// console.log('Criando mensagem: ', oQuetaVindoComoRespostas)
			});
		setMensagem('');


	}

	return (
		<Box
			styleSheet={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				backgroundImage: `url(https://images.pexels.com/photos/2346594/pexels-photo-2346594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
				backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
				color: appConfig.theme.colors.neutrals['000']
			}}
		>
			<Box
				styleSheet={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700],
					height: '100%',
					maxWidth: '95%',
					maxHeight: '95vh',
					padding: '32px',
				}}
			>
				<Header />
				<Box
					styleSheet={{
						position: 'relative',
						display: 'flex',
						flex: 1,
						height: '80%',
						backgroundColor: appConfig.theme.colors.neutrals[600],
						flexDirection: 'column',
						borderRadius: '5px',
						padding: '16px',
					}}
				>

					<MessageList mensagens={listaDeMensagens} set={setListaDeMensagens} />
					
					{/*{listaDeMensagens.map((mensagemAtual) => {
						console.log(mensagemAtual);
						return(
							<li key={mensagemAtual.id}>
								{mensagemAtual.de}: {mensagemAtual.texto}
							</li>
						)
					})}*/}

					<Box
						as="form"
						styleSheet={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<TextField

							value={mensagem}
							onChange={(event) => {
								// console.log(event);
								const valor = event.target.value;
								setMensagem(valor);
							}}
							onKeyPress={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
									handleNovaMensagem(mensagem);
								}
							}}
							placeholder="Insira sua mensagem aqui..."
							type="textarea"
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '12px',
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
						{/* {CallBack} */}
						<ButtonSendSticker
							onStickerClick={(sticker) => {
								console.log('Salva esse sticker no banco'), sticker;
								handleNovaMensagem(':sticker' + sticker);
							}}

						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header() {
	return (
		<>
			<Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
				<Text variant='heading5'>
					Chat
				</Text>
				<Button
					variant='tertiary'
					colorVariant='neutral'
					label='Logout'
					href="/"
				/>
			</Box>
		</>
	)
}

function MessageList(props) {
	console.log(props.listaDeMensagens);
	return (
		<Box
			tag="ul"
			styleSheet={{
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column-reverse',
				flex: 1,
				color: appConfig.theme.colors.neutrals["000"],
				marginBottom: '16px',
			}}
		>
			{props.mensagens.map((mensagem) => {
				return (
					<Text
						key={mensagem.id}
						tag="li"
						styleSheet={{
							borderRadius: '5px',
							padding: '6px',
							marginBottom: '12px',
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							}
						}}
					>
						<Box
							styleSheet={{
								display: 'flex',
								marginBottom: '8px',
							}}
						>
							<Image
								styleSheet={{
									width: '20px',
									height: '20px',
									borderRadius: '50%',
									display: 'inline-block',
									marginRight: '8px',
								}}
								src={`https://github.com/${mensagem.de}.png`}
							/>
							<Text tag="strong">
								{mensagem.de}
							</Text>
							<Text
								styleSheet={{
									fontSize: '10px',
									marginLeft: '8px',
									color: appConfig.theme.colors.neutrals[300],
								}}
								tag="span"
							>
								{(new Date().toLocaleDateString())}
							</Text>

							<Box
                                styleSheet={{
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center'

                                }}
                            >
                                <button onClick={() => {
                                    const deletarDaLista = props.mensagens.filter(object => object.id !== mensagem.id)
                                    props.set(deletarDaLista)
                                }}
                                ><img src="http://www.abifina.org.br/flutuante/close_menu.png" height={'20px'}></img></button>
                                <style jsx>{`
                                button{
                                    height: 30px;
                                    background: none;
                                    border: none;
                                    border-radius: 2px;
                                    padding: 5px;
                                    cursor:pointer;
                                    }
                                button:hover{
                                    background: red;
                                }
                                `}
                                </style>
                            </Box>
						</Box>
				

						{/* {Declarativo} */}
						{/* Condicional: {mensagem.texto.startWith(':sticker:').toString()} */}
						{mensagem.texto.startsWith(':sticker')

							? (
								< Image src={mensagem.texto.replace(':sticker', '')} />
							)
							: (
								mensagem.texto
							)}


						{/* if mensagem de texto possui stickers:
								 	mostra a imagem
									 else
									 mensagem.texto */}

						
					</Text>
				);
			})}

		</Box>
	)
}