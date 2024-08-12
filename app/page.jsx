'use client'
import Image from "next/image";
import { useEffect, useState } from "react"; 
import { Box, Button, Input, Stack, Text, TextField } from "@mui/material";
import HeaderBar from "./components/HeaderBar";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I am Himawari! How can I help you today?`,
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        content: ''
      },
    ])
    const respone = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then ( async(res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}){
        if (done){
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length-1]
          let otherMessages = messages.slice(0, messages.length-1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter'){
      sendMessage()
    }
  }

  return (
    <Box
      width='100vw' 
      height='100vh' 
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      bgcolor='white'
    >
      <HeaderBar/>
      <Box 
        width='800px'
        height='1000px'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        border='1px solid black'
        padding={5}
      >
        <Stack 
          direction='column'
          spacing={2}
          flexGrow={1}
          overflow='auto'
          maxHeight='100%'
          width='100%'
        >
          {messages.map((message, index) => (
            <Box key={index}
              display='flex'
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                }
                color='white'
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction='row' spacing={2} width='100%'>
          <TextField
            label='message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <Button vairant='contained' onClick={sendMessage}>Send</Button>
            
            
        </Stack>
      </Box>
    </Box> 

  )
 
}
