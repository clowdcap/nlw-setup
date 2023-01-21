import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { FormEvent, useState } from 'react'
import { api } from '../lib/axios'

export const NewHabitForm = () => {

    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])
    const [message, setMessage] = useState('')
    
    const avaiableWeekDays = [
        'Domingo', 
        'Segunda-Feira', 
        'Terça-Feira', 
        'Quarta-Feira', 
        'Quinta-Feira', 
        'Sexta-Feira', 
        'Sábado'
    ]

    const createNewForm = async (event: FormEvent) => {

        event.preventDefault()
        console.log(title, weekDays)

        setMessage('')

        if (!title || weekDays.length === 0) {
            return
        } 

        await api.post('habits', {
            title,
            weekDays
        })

        setTitle('')
        setWeekDays([])

        setMessage('Habito registrado com sucesso')
        
    }

    const handleToggleWeekDay = (weekDay: number) => {
        if (weekDays.includes(weekDay)) { 
            const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
            setWeekDays(weekDaysWithRemovedOne)
        } else {
            const weekDaysWithAddedOne = [...weekDays, weekDay]
            setWeekDays(weekDaysWithAddedOne)
        }
    }

    return (
        <form 
            onSubmit={createNewForm}
            className="w-full flex flex-col mt-6">
            <label 
                htmlFor="title"
                className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                type="text" 
                name="tile" 
                id="title" 
                onChange={event => setTitle(event.target.value) }
                placeholder="Exercício, Dormir, Estudar etc..."
                autoFocus 
                value={title}
            />
            
            <label 
                htmlFor=""
                className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

                                
            <div className="flex flex-col gap-3 mt-3">
                {avaiableWeekDays.map( (weekDay, index) => {
                    return (
                        <Checkbox.Root
                            key={weekDay}
                            className='flex items-center gap-3 group'
                            checked={weekDays.includes(index)}
                            onCheckedChange={ () => handleToggleWeekDay(index) }
                        >

                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white' />
                                </Checkbox.Indicator>
                            </div>

                            <span
                                className='text-white leading-tight' >
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}
            </div>


            <button 
                type="submit"
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confirmar
            </button>

            <p className='mt-6 flex items-center justify-center font-semibold text-lg text-green-500'>
                {message}
            </p>

        </form>
    )
}