import { useEffect, useState } from "react"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { HabitDayOff } from "./HabitDayOff"
import { WeekDays } from "./WeekDays"
import { api } from "../lib/axios"
import dayjs from "dayjs"


const weekDays = ['D', 'S', 'T','Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimunSummaryDateSize = 18 * 7

const amountOfDaysToFill = minimunSummaryDateSize - summaryDates.length

type Summary = {
    id: string,
    date: string,
    amount: number,
    completed: number,
}[]

export const SummaryTable = () => {

    const [summary, setSummary] = useState<Summary>([])

    useEffect(() => {
        api.get('summary')
            .then((response) => {
                // console.log(response.data)  
                setSummary(response.data)
            })
        }, [])
        
    useEffect(() => {
        // console.log('summary', summary)
    }, [summary])
    
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                
                {weekDays.map((weekDay, i) =>(
                    <WeekDays key={`${weekDay}-${i}`} day={weekDay}/>
                ))}

            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                
                {summary.length > 0 && summaryDates.map((date, i) => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day')
                    })
                    
                    return (
                        <HabitDay 
                            key={date.toString()}
                            date={date}
                            amount={dayInSummary?.amount} 
                            defaltCompleted={dayInSummary?.completed} 
                        />
                    )
                })}

                {amountOfDaysToFill > 0 && Array
                    .from({length: amountOfDaysToFill })
                    .map((_, i) => {
                    return (
                        <HabitDayOff key={i}/>
                    )
                })}

            </div>

        </div>
    )
}