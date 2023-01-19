import Fastify from "fastify"
import cors from "@fastify/cors"
import { habitRouter } from "./routes/habit"

// logger mostra todo o log do sistema
async function bootstrap() {
    const fastify = Fastify({
        logger: true
    })
    
    await fastify.register(cors, {
        origin: true
    })
    
    fastify.get('/', ()=> {
        return 'Bem vindo ao Backend'
    })

    fastify.register(habitRouter)
	
    // ligar o server
    await fastify.listen({ port: 5000 })
}

// inicia o fastify
bootstrap()