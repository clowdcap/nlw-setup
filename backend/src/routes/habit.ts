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
        // console.log('Date: ', date)

        const parsedDate = dayjs(date).startOf('day')
        // console.log('parsedDate: ', parsedDate.toDate())
        
        const weekDay = parsedDate.get('day')
        // console.log('weekday: ', weekDay)
        
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

        // console.log('day:', day)
        // console.log('possible:', possibleHabits)
        
        const completedHabits = day?.dayHabits.map((dayHabit) => {
            return dayHabit.habit_id
        })
        
        // console.log('completedHabits:', completedHabits)
        

        return {
            possibleHabits,
            completedHabits,
        }

    })

    // Completa e descompleta um habito
    fastify.patch('/habits/:id/toggle', async (request) => {
        
        const completeHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = completeHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        if (dayHabit) {
            // remover a marcação de completo
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }

        // completa habito do dia
        await prisma.dayHabit.create({
            data: {
                day_id: day.id,
                habit_id: id,
            }
        })

    })

    // Sumario da data
    fastify.get('/summary', async (request) => {
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date, (
                    SELECT 
                        cast(count(*) as float) 
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount

                
                
            FROM days D
        `

        return summary
    })
}