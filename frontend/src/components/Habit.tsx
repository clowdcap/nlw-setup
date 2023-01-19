interface HabitProps {
    completed: number
}

export const Habit = (props: HabitProps) => {
    return (
        <div className="bg-zinc-900 w-10 h-10 text-white rounded flex items-center justify-center m-2"
        >{props.completed}</div>
    )
}