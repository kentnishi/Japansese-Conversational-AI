'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from "react"; 
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
    try{
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, {role: 'user', content: message}]),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      reader.read().then(function processText({done, value}){
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
    } catch (error){
      console.error('Error sending message:', error)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter'){
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        height='600px'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        border='1px solid black'
        borderRadius={8}
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
              mb={2}
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                }
                color='white'
                borderRadius={8}
                pr={3}
                pl={3}
                pt={2}
                pb={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction='row' spacing={2} width='100%' padding={2}>
          <TextField
            label='message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant='outlined'
            />
            <Button variant='contained' onClick={sendMessage}>Send</Button>
            
            
        </Stack>
      </Box>
    </Box> 

  )
 
}
