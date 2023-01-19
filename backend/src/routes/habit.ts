import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from './../lib/prisma'
import dayjs from 'dayjs'


export async function habitRouter(fastify: FastifyInstance) {

    // Ve contagem de todos os Habitos Registrados no DB
    fastify.get('/count', async () => {
    
        const count = await prisma.habit.count()
        return { count }
    
    })
    
    // Ve todos os Habitos Registrados no DB
    fastify.get('/all', async () => {

        const habits = await prisma.habit.findMany()
        return habits
        
    })

    // Cria Habito no DB
    fastify.post('/habits', async (request) => {

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ),
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map((weekDays) => {
                        return {
                            week_day: weekDays
                        }
                    })
                }
            },
        })
    })

    // Ve todos os Habitos Registrados no DB da data passada
    fastify.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)
        console.log('Date: ', date)

        const parsedDate = dayjs(date).startOf('day')
        console.log('parsedDate: ', parsedDate.toDate())
        
        const weekDay = parsedDate.get('day')
        console.log('weekday: ', weekDay)
        
        // todos habitos possiveis
        
        // habitos que ja foram completados

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date, 
                },

                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },

            include: {
                dayHabits: true,
            }

        })

        console.log('day:', day)
        console.log('possible:', possibleHabits)

        const completedHabits = day?.dayHabits.map((dayHabit) => {
            return dayHabit.habit_id
        })

        

        return {
            possibleHabits,
            completedHabits,
        }

    })
}