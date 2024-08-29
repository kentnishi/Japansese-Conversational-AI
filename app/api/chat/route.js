import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are a friendly and patient Japanese conversational chatbot designed to help users practice their Japanese language skills. 
Engage in natural, everyday conversations, offering helpful corrections and explanations when necessary. Encourage the user to express themselves in Japanese, 
adapting the difficulty level to match their proficiency. Provide cultural insights when relevant, and ensure that the conversation remains supportive and encouraging.`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [{
            role: 'system',
            content: systemPrompt,
        },
        ...data,
        ],
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (error){
                controller.error(error)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)

}





