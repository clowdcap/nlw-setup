import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { HabitDayOff } from "./HabitDayOff"
import { WeekDays } from "./WeekDays"


export const SummaryTable = () => {
    const weekDays = ['D', 'S', 'T','Q', 'Q', 'S', 'S']
    
    const summaryDates = generateDatesFromYearBeginning()
    
    const minimunSummaryDateSize = 18 * 7

    const amountOfDaysToFill = minimunSummaryDateSize - summaryDates.length

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                
                {weekDays.map((weekDay, i) =>(
                    <WeekDays key={`${weekDay}-${i}`} day={weekDay}/>
                ))}

            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                
                {summaryDates.map((date, i) => {
                    return (
                        <HabitDay 
                            key={date.toString()}
                            amount={5} 
                            completed={Math.round(Math.random() * 5)} 
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