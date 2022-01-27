import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwODc4MSwiZXhwIjoxOTU4ODg0NzgxfQ.RHFr2LH8sUn0MiOI9tlFVEW6gN6B3ytFIMbg35U1EqA"
const SUPABASE_URL = "https://nhjpnxilzupdjrftvpor.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

export default function ChatPage() {
    const from = appConfig.username
    const [mensagem, setMensagem] = React.useState("")
    const [listaMensagem, setListaMensagem] = React.useState([])

    React.useEffect(() => {
        supabaseClient
            .from("Mensagens")
        .select("*")
        .order("id", {ascending: false})
        .then(({ data }) => {
            setListaMensagem(data)
        })
    }, [listaMensagem])

    function handleNovaMensagem(novaMensagem) {
        const messageInfo = {
            texto: novaMensagem,
            de: from,
        }

        supabaseClient
            .from("Mensagens")
            .insert([messageInfo])
            .then(({ data }) => {
                setListaMensagem([
                    data[0],
                    ...listaMensagem
                ])
            })

        setMensagem("")
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[300],
                backgroundImage: 'url(https://cdn.pixabay.com/photo/2021/12/11/15/06/northern-lights-6862969_960_720.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                backgroundPosition: 'top',
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
                    <MessageList mensagens={listaMensagem} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={event => {
                                setMensagem(event.target.value)
                            }}

                            onKeyPress={event => {
                                if (event.key == "Enter" && event.shiftKey == false) {
                                    event.preventDefault()
                                    if (event.target.value != "") handleNovaMensagem(mensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type='textarea'
                            styleSheet={{
                                height: '50px',
                                width: "100%",
                                overflowY: "visible",
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
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
                <Box variant='heading5'
                    styleSheet={{
                        display: "flex"
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '5px',
                        }}
                        src={`https://github.com/${appConfig.username}.png`}
                    />
                    {appConfig.username}
                </Box>
                <Button
                    variant='tertiary'
                    colorVariant='light'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                scrollBar: "",
                display: 'flex',
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
                paddingRight: "10px",
            }}
        >
            {props.mensagens.map(mensagem => {
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
                            },
                            whiteSpace: "pre-line",
                            fontFamily: "'Outfit', sans-serif",
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '5px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong" styleSheet={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "15px",
                            }}>
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
                        </Box>
                        {mensagem.texto}
                    </Text>
                )
            })}
        </Box>
    )
}