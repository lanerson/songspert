export default function ResponseOptions() {

    let options: string[] = ['option 1', 'option 2', 'option 3', 'option 4']
    return (
        <div>
            {options.map((op) => <div>{op}</div>)}
        </div>
    )
}