interface WeekDaysProos {
    day: string;

}
export const WeekDays = (props: WeekDaysProos) => {
    return (
        <div className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold">
            {props.day}
        </div>
    )
}